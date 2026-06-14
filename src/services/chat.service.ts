// ============================================
// Promoo Backend — Chat Service
// ============================================

import { supabaseAdmin } from '../config/supabase';
import { ApiError } from '../utils/apiError';

interface ISendMessagePayload {
  content?: string;
  type: 'text' | 'image' | 'video' | 'file';
  mediaUrl?: string;
}

export class ChatService {
  /**
   * Start or open a direct chat with another user.
   * If a direct chat already exists between the two users, return it.
   * Otherwise, create a new chat room.
   */
  async startOrOpenChat(currentUserId: string, participantId: string): Promise<Record<string, unknown>> {
    if (currentUserId === participantId) {
      throw ApiError.badRequest('Cannot start a chat with yourself');
    }

    // Check if participant exists
    const { data: participant } = await supabaseAdmin
      .from('profiles')
      .select('id, full_name, avatar_url')
      .eq('id', participantId)
      .single();

    if (!participant) {
      throw ApiError.notFound('User not found');
    }

    // Check if a direct chat already exists between these two users
    const { data: existingRooms } = await supabaseAdmin
      .from('chat_participants')
      .select('room_id')
      .eq('profile_id', currentUserId);

    if (existingRooms && existingRooms.length > 0) {
      const roomIds = existingRooms.map((r) => r.room_id);

      // Check if participant is in any of these rooms AND the room is 'direct'
      const { data: sharedRoom } = await supabaseAdmin
        .from('chat_participants')
        .select('room_id, chat_rooms!inner(id, type)')
        .eq('profile_id', participantId)
        .in('room_id', roomIds)
        .limit(1)
        .maybeSingle();

      if (sharedRoom) {
        // Return the existing room with participant info
        const { data: room } = await supabaseAdmin
          .from('chat_rooms')
          .select('*')
          .eq('id', sharedRoom.room_id)
          .single();

        return { room, participant, isNew: false };
      }
    }

    // Create new chat room
    const { data: newRoom, error: roomError } = await supabaseAdmin
      .from('chat_rooms')
      .insert({ type: 'direct' })
      .select()
      .single();

    if (roomError || !newRoom) {
      throw ApiError.internal(roomError?.message || 'Failed to create chat room');
    }

    // Add both participants
    const { error: participantsError } = await supabaseAdmin
      .from('chat_participants')
      .insert([
        { room_id: newRoom.id, profile_id: currentUserId },
        { room_id: newRoom.id, profile_id: participantId },
      ]);

    if (participantsError) {
      // Cleanup: delete the room if we failed to add participants
      await supabaseAdmin.from('chat_rooms').delete().eq('id', newRoom.id);
      throw ApiError.internal(participantsError.message);
    }

    return { room: newRoom, participant, isNew: true };
  }

  /**
   * Send a message to a chat room
   */
  async sendMessage(
    currentUserId: string,
    roomId: string,
    payload: ISendMessagePayload
  ): Promise<Record<string, unknown>> {
    // Verify the user is a participant
    await this.verifyParticipant(currentUserId, roomId);

    const { data: message, error } = await supabaseAdmin
      .from('messages')
      .insert({
        room_id: roomId,
        sender_id: currentUserId,
        content: payload.content || null,
        type: payload.type,
        media_url: payload.mediaUrl || null,
      })
      .select('*, sender:profiles!sender_id(id, full_name, avatar_url)')
      .single();

    if (error || !message) {
      throw ApiError.internal(error?.message || 'Failed to send message');
    }

    return message;
  }

  /**
   * Get messages for a chat room with pagination
   */
  async getMessages(
    currentUserId: string,
    roomId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{ data: Record<string, unknown>[]; total: number; page: number; limit: number; totalPages: number }> {
    // Verify the user is a participant
    await this.verifyParticipant(currentUserId, roomId);

    const offset = (page - 1) * limit;

    // Get total count
    const { count } = await supabaseAdmin
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('room_id', roomId);

    const total = count || 0;

    // Get messages (newest first)
    const { data: messages, error } = await supabaseAdmin
      .from('messages')
      .select('*, sender:profiles!sender_id(id, full_name, avatar_url)')
      .eq('room_id', roomId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw ApiError.internal(error.message);
    }

    return {
      data: messages || [],
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get the list of chats for the current user
   */
  async getChatList(
    currentUserId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{ data: Record<string, unknown>[]; total: number; page: number; limit: number; totalPages: number }> {
    const offset = (page - 1) * limit;

    // Get all rooms the user is part of
    const { count } = await supabaseAdmin
      .from('chat_participants')
      .select('*', { count: 'exact', head: true })
      .eq('profile_id', currentUserId);

    const total = count || 0;

    const { data: participantEntries, error: pError } = await supabaseAdmin
      .from('chat_participants')
      .select('room_id, last_read_at')
      .eq('profile_id', currentUserId)
      .order('last_read_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (pError || !participantEntries) {
      throw ApiError.internal(pError?.message || 'Failed to fetch chats');
    }

    if (participantEntries.length === 0) {
      return { data: [], total: 0, page, limit, totalPages: 0 };
    }

    const roomIds = participantEntries.map((p) => p.room_id);

    // Get rooms with last_message_at
    const { data: rooms } = await supabaseAdmin
      .from('chat_rooms')
      .select('*')
      .in('id', roomIds)
      .order('last_message_at', { ascending: false });

    if (!rooms) {
      return { data: [], total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    // For each room, get the other participant's info and the last message
    const chatList: Record<string, unknown>[] = [];

    for (const room of rooms) {
      // Get the other participant
      const { data: otherParticipant } = await supabaseAdmin
        .from('chat_participants')
        .select('profile_id, profiles!inner(id, full_name, avatar_url)')
        .eq('room_id', room.id)
        .neq('profile_id', currentUserId)
        .single();

      // Get the last message
      const { data: lastMessage } = await supabaseAdmin
        .from('messages')
        .select('id, content, type, created_at, sender_id')
        .eq('room_id', room.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      // Count unread messages
      const participantEntry = participantEntries.find((p) => p.room_id === room.id);
      const lastReadAt = participantEntry?.last_read_at || room.created_at;

      const { count: unreadCount } = await supabaseAdmin
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('room_id', room.id)
        .neq('sender_id', currentUserId)
        .gt('created_at', lastReadAt);

      chatList.push({
        room,
        otherParticipant: otherParticipant?.profiles || null,
        lastMessage: lastMessage || null,
        unreadCount: unreadCount || 0,
      });
    }

    return {
      data: chatList,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Mark all messages in a room as read
   */
  async markAsRead(currentUserId: string, roomId: string): Promise<void> {
    await this.verifyParticipant(currentUserId, roomId);

    // Update last_read_at for the current user
    const { error } = await supabaseAdmin
      .from('chat_participants')
      .update({ last_read_at: new Date().toISOString() })
      .eq('room_id', roomId)
      .eq('profile_id', currentUserId);

    if (error) {
      throw ApiError.internal(error.message);
    }

    // Also mark messages as read
    await supabaseAdmin
      .from('messages')
      .update({ is_read: true })
      .eq('room_id', roomId)
      .neq('sender_id', currentUserId)
      .eq('is_read', false);
  }

  /**
   * Delete a chat (remove user from participants, not the room itself)
   */
  async deleteChat(currentUserId: string, roomId: string): Promise<void> {
    await this.verifyParticipant(currentUserId, roomId);

    // Remove user from participants
    const { error } = await supabaseAdmin
      .from('chat_participants')
      .delete()
      .eq('room_id', roomId)
      .eq('profile_id', currentUserId);

    if (error) {
      throw ApiError.internal(error.message);
    }

    // If no participants remain, delete the room entirely
    const { count } = await supabaseAdmin
      .from('chat_participants')
      .select('*', { count: 'exact', head: true })
      .eq('room_id', roomId);

    if (count === 0) {
      await supabaseAdmin.from('chat_rooms').delete().eq('id', roomId);
    }
  }

  // ──────────────────────────────────────────
  // Private Helpers
  // ──────────────────────────────────────────

  /**
   * Verify that the user is a participant of the room
   */
  private async verifyParticipant(userId: string, roomId: string): Promise<void> {
    const { data, error } = await supabaseAdmin
      .from('chat_participants')
      .select('id')
      .eq('room_id', roomId)
      .eq('profile_id', userId)
      .maybeSingle();

    if (error) {
      throw ApiError.internal(error.message);
    }

    if (!data) {
      throw ApiError.forbidden('You are not a participant of this chat');
    }
  }
}

export const chatService = new ChatService();
