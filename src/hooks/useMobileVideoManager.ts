
import { useState, useRef, useCallback, useEffect } from 'react';

interface VideoInstance {
  id: string;
  videoRef: React.RefObject<HTMLVideoElement>;
  isPlaying: boolean;
  component: string;
}

// Singleton für mobile Video-Verwaltung
class MobileVideoManager {
  private static instance: MobileVideoManager;
  private videos: Map<string, VideoInstance> = new Map();
  private activeVideoId: string | null = null;
  private listeners: Set<() => void> = new Set();

  static getInstance(): MobileVideoManager {
    if (!MobileVideoManager.instance) {
      MobileVideoManager.instance = new MobileVideoManager();
    }
    return MobileVideoManager.instance;
  }

  registerVideo(id: string, videoRef: React.RefObject<HTMLVideoElement>, component: string) {
    console.log('📱 Registering video:', { id, component });
    this.videos.set(id, {
      id,
      videoRef,
      isPlaying: false,
      component
    });
    this.notifyListeners();
  }

  unregisterVideo(id: string) {
    console.log('📱 Unregistering video:', id);
    if (this.activeVideoId === id) {
      this.activeVideoId = null;
    }
    this.videos.delete(id);
    this.notifyListeners();
  }

  async playVideo(id: string): Promise<boolean> {
    console.log('📱 Play video request:', id);
    const video = this.videos.get(id);
    if (!video?.videoRef.current) {
      console.warn('📱 Video not found or ref missing:', id);
      return false;
    }

    // Pause all other videos first
    await this.pauseAllExcept(id);

    try {
      await video.videoRef.current.play();
      this.activeVideoId = id;
      video.isPlaying = true;
      this.notifyListeners();
      console.log('📱 Video playing successfully:', id);
      return true;
    } catch (error) {
      console.error('📱 Video play failed:', error);
      return false;
    }
  }

  async pauseVideo(id: string): Promise<void> {
    console.log('📱 Pause video:', id);
    const video = this.videos.get(id);
    if (video?.videoRef.current && !video.videoRef.current.paused) {
      video.videoRef.current.pause();
      video.isPlaying = false;
      if (this.activeVideoId === id) {
        this.activeVideoId = null;
      }
      this.notifyListeners();
    }
  }

  private async pauseAllExcept(exceptId: string): Promise<void> {
    console.log('📱 Pausing all videos except:', exceptId);
    const pausePromises: Promise<void>[] = [];
    
    for (const [id, video] of this.videos) {
      if (id !== exceptId && video.isPlaying && video.videoRef.current) {
        pausePromises.push(this.pauseVideo(id));
      }
    }
    
    await Promise.all(pausePromises);
  }

  isVideoActive(id: string): boolean {
    return this.activeVideoId === id;
  }

  getActiveVideoId(): string | null {
    return this.activeVideoId;
  }

  addListener(callback: () => void) {
    this.listeners.add(callback);
  }

  removeListener(callback: () => void) {
    this.listeners.delete(callback);
  }

  private notifyListeners() {
    this.listeners.forEach(callback => callback());
  }
}

export const useMobileVideoManager = (isMobile: boolean) => {
  const manager = useRef(MobileVideoManager.getInstance());
  const [, forceUpdate] = useState({});

  const triggerUpdate = useCallback(() => {
    forceUpdate({});
  }, []);

  useEffect(() => {
    if (isMobile) {
      manager.current.addListener(triggerUpdate);
      return () => {
        manager.current.removeListener(triggerUpdate);
      };
    }
  }, [isMobile, triggerUpdate]);

  return {
    registerVideo: useCallback((id: string, videoRef: React.RefObject<HTMLVideoElement>, component: string) => {
      if (isMobile) {
        manager.current.registerVideo(id, videoRef, component);
      }
    }, [isMobile]),
    
    unregisterVideo: useCallback((id: string) => {
      if (isMobile) {
        manager.current.unregisterVideo(id);
      }
    }, [isMobile]),
    
    playVideo: useCallback(async (id: string) => {
      if (isMobile) {
        return await manager.current.playVideo(id);
      }
      return true;
    }, [isMobile]),
    
    pauseVideo: useCallback(async (id: string) => {
      if (isMobile) {
        await manager.current.pauseVideo(id);
      }
    }, [isMobile]),
    
    isVideoActive: useCallback((id: string) => {
      if (isMobile) {
        return manager.current.isVideoActive(id);
      }
      return false;
    }, [isMobile]),
    
    getActiveVideoId: useCallback(() => {
      if (isMobile) {
        return manager.current.getActiveVideoId();
      }
      return null;
    }, [isMobile])
  };
};
