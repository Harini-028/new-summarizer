import net from 'net';

/**
 * Searches dynamically for the next available TCP port starting from the given port.
 * Helps prevent EADDRINUSE collisions.
 */
export async function findAvailablePort(startPort: number): Promise<number> {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.unref();
    
    server.on('error', () => {
      // If port is occupied, try the next port recursively
      resolve(findAvailablePort(startPort + 1));
    });

    server.listen(startPort, '0.0.0.0', () => {
      server.close(() => {
        resolve(startPort);
      });
    });
  });
}
