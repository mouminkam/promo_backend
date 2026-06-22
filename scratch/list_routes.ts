import app from '../src/app';

function printRoutes(layer: any, prefix: string = '') {
  if (layer.route) {
    const path = prefix + layer.route.path;
    const methods = Object.keys(layer.route.methods)
      .map(method => method.toUpperCase())
      .join(', ');
    console.log(`${methods} ${path}`);
  } else if (layer.name === 'router' && layer.handle.stack) {
    let newPrefix = prefix;
    if (layer.regexp && layer.regexp.source) {
        // Simple extraction of router prefix
        const match = layer.regexp.source.match(/\^\/([^?]+)\\\/\?/);
        if(match && match[1]) {
            let p = match[1].replace(/\\\//g, '/');
            newPrefix += '/' + p;
        }
    }
    layer.handle.stack.forEach((stackItem: any) => printRoutes(stackItem, newPrefix));
  }
}

console.log('--- ALL ROUTES ---');
app._router.stack.forEach((layer: any) => printRoutes(layer, ''));
console.log('------------------');
