/**
 * TikTok Downloader API
 * Based on code by Naufal Taufiq Ridwan
 * Github: https://github.com/n0l3r
 */

import fetch from 'node-fetch';
import type { Response } from 'node-fetch';

interface VideoData {
  url: string;
  id: string;
  isSlideshow: boolean;
  images?: string[];
}

/**
 * Gets the video ID from a TikTok URL
 */
async function getVideoId(url: string): Promise<string> {
  // Handle redirects for shortened URLs
  if (url.includes('vm.tiktok.com') || url.includes('vt.tiktok.com')) {
    const response = await fetch(url, {
      redirect: 'follow',
      follow: 10,
    });
    url = response.url;
    console.log('[TikTok] Redirected to:', url);
  }

  const isVideo = url.includes('/video/');
  const isPhoto = url.includes('/photo/');

  if (!isVideo && !isPhoto) {
    throw new Error('URL is not a valid TikTok video or photo URL');
  }

  const idStartIndex = isVideo ? url.indexOf('/video/') + 7 : url.indexOf('/photo/') + 7;
  let videoId = url.substring(idStartIndex, idStartIndex + 19);
  
  // Clean up the ID if it has query parameters
  if (videoId.includes('?')) {
    videoId = videoId.substring(0, videoId.indexOf('?'));
  }

  return videoId;
}

/**
 * Gets video data from TikTok API
 */
export async function getVideoData(url: string, withWatermark = false): Promise<VideoData> {
  try {
    const videoId = await getVideoId(url);
    
    // TikTok API URL
    const apiUrl = `https://api22-normal-c-alisg.tiktokv.com/aweme/v1/feed/?aweme_id=${videoId}&iid=7318518857994389254&device_id=7318517321748022790&channel=googleplay&app_name=musical_ly&version_code=300904&device_platform=android&device_type=ASUS_Z01QD&version=9`;
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json() as any;

    // Check if we have valid data
    if (!data.aweme_list || data.aweme_list.length === 0 || data.aweme_list[0].aweme_id !== videoId) {
      throw new Error('Video not found or has been deleted');
    }

    const aweme = data.aweme_list[0];
    let mediaUrl = '';
    let images: string[] = [];
    let isSlideshow = false;

    // Check if post is a slideshow (multiple images)
    if (aweme.image_post_info) {
      isSlideshow = true;
      console.log('[TikTok] Content is a slideshow');

      // Get all image URLs
      aweme.image_post_info.images.forEach((element: any) => {
        // url_list[1] typically contains a jpeg
        if (element.display_image?.url_list?.length > 1) {
          images.push(element.display_image.url_list[1]);
        }
      });
    } 
    // It's a video
    else if (aweme.video) {
      const video = aweme.video;

      // Get video with watermark if requested
      if (withWatermark && video.download_addr?.url_list?.length > 0) {
        mediaUrl = video.download_addr.url_list[0];
      } 
      // Get video without watermark (or fallback if with-watermark URL not found)
      else if (video.play_addr?.url_list?.length > 0) {
        mediaUrl = video.play_addr.url_list[0];
      } else {
        throw new Error('Video download URLs not found');
      }
    } else {
      throw new Error('Content format not supported');
    }

    return {
      url: mediaUrl,
      id: videoId,
      isSlideshow,
      images: images.length > 0 ? images : undefined
    };
  } catch (error) {
    console.error('[TikTok] Error:', error);
    throw error;
  }
}