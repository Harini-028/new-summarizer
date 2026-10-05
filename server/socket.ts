import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';

let ioInstance: Server | null = null;
const userSockets = new Map<string, string[]>(); // userId -> array of socketIds

export function initSocket(server: HttpServer): Server {
  ioInstance = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  ioInstance.on('connection', (socket: Socket) => {
    // Listen for client identification
    socket.on('authenticate', (userId: string) => {
      if (!userId) return;
      socket.data.userId = userId;
      
      const current = userSockets.get(userId) || [];
      if (!current.includes(socket.id)) {
        current.push(socket.id);
        userSockets.set(userId, current);
      }
      
      // Send a welcome alert
      socket.emit('news_feed_sync', { status: 'synchronized', timestamp: new Date().toISOString() });
    });

    socket.on('disconnect', () => {
      const userId = socket.data.userId;
      if (userId) {
        const current = userSockets.get(userId) || [];
        const filtered = current.filter(id => id !== socket.id);
        if (filtered.length > 0) {
          userSockets.set(userId, filtered);
        } else {
          userSockets.delete(userId);
        }
      }
    });
  });

  console.log('Successfully initialized Socket.io real-time connection manager.');
  return ioInstance;
}

export function sendNotificationToUser(userId: string, notification: any) {
  if (!ioInstance) return;
  const socketIds = userSockets.get(userId);
  if (socketIds && socketIds.length > 0) {
    socketIds.forEach(socketId => {
      ioInstance?.to(socketId).emit('notification', notification);
    });
  }
}

export function broadcastBreakingNews(article: any) {
  if (!ioInstance) return;
  ioInstance.emit('breaking_news', {
    id: article.id || article._id?.toString() || 'art_' + Date.now(),
    title: article.title,
    excerpt: article.excerpt,
    imageUrl: article.imageUrl,
    category: article.category,
    sourceName: article.source?.name || 'Chronicle Wire',
    publishedAt: new Date().toISOString()
  });
}

export function broadcastNewsPublished(article: any) {
  if (!ioInstance) return;
  ioInstance.emit('news:published', {
    id: article.id || article._id?.toString() || 'art_' + Date.now(),
    title: article.title,
    excerpt: article.excerpt || article.description,
    imageUrl: article.imageUrl,
    category: article.category,
    author: article.author,
    sourceName: article.source?.name || 'Chronicle Wire',
    publishedAt: article.publishedAt || new Date().toISOString(),
    isBreaking: article.isBreaking || false,
    isFeatured: article.isFeatured || false
  });
}
