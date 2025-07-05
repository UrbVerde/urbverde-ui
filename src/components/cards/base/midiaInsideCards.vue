<!-- urbverde-ui/src/components/cards/base/midiaInsideCards.vue -->
<template>
  <div class="midia-wrapper">
    <!-- Image handling -->
    <img
      v-if="typeMidia === 'image'"
      :src="imageSrc"
      :alt="imageAlt"
      class="midia-image"
    />

    <!-- Video handling -->
    <div v-else-if="typeMidia === 'video'" class="video-container">
      <div class="video-thumbnail" @click="openVideoModal">
        <img
          :src="getVideoThumbnail(videoUrl)"
          alt="Video thumbnail"
          class="video-thumbnail-img"
        />
        <div class="video-overlay">
          <span class="play-button">
            <svg class="play-triangle" viewBox="0 0 60 60">
              <polygon points="15,10 50,30 15,50" />
            </svg>
          </span>
        </div>
      </div>
    </div>

    <!-- Video Modal -->
    <teleport to="body">
      <div v-if="showVideoModal" class="video-modal" @click="closeVideoModal">
        <div class="modal-content" @click.stop>
          <button class="close-button" @click="closeVideoModal">&times;</button>
          <iframe
            :src="getEmbedUrl(videoUrl)"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script>
export default {
  name: 'MidiaInsideCards',
  props: {
    typeMidia: {
      type: String,
      required: true,
      validator: (value) => ['image', 'video'].includes(value)
    },
    // For images
    imageSrc: {
      type: [String, Object],
      required: false
    },
    imageAlt: {
      type: String,
      default: 'Imagem'
    },
    // For videos
    videoUrl: {
      type: String,
      required: false
    }
  },
  data() {
    return {
      showVideoModal: false
    };
  },
  methods: {
    openVideoModal() {
      this.showVideoModal = true;
    },
    closeVideoModal() {
      this.showVideoModal = false;
    },
    getVideoThumbnail(url) {
      const videoId = this.extractVideoId(url);

      return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    },
    getEmbedUrl(url) {
      const videoId = this.extractVideoId(url);

      return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    },
    extractVideoId(url) {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);

      return (match && match[2].length === 11) ? match[2] : null;
    }
  }
};
</script>

<style scoped lang="scss">
@import '@/assets/styles/breakpoints.scss';

.midia-wrapper {
  display: flex;
  padding: 16px 24px;
  width: auto;
  height: auto;
  align-items: center;
  justify-content: center;
}

.midia-image {
  max-width: 280px;
  max-height: 280px;
  min-width: 180px;
  min-height: 180px;
  width: 100%;
  height: auto;
  object-fit: contain;
  border-radius: 16px;
}

.video-container {
  width: 504px;
  aspect-ratio: 16 / 9;
  position: relative;
  cursor: pointer;
  border-radius: 16px;
  overflow: hidden;
  height: auto;
}

@include breakpoint-down('mobile-large') {
  .video-container {
    width: 100%;
    aspect-ratio: 16 / 9;
    height: auto;
    min-width: 0;
  }
}

.video-thumbnail {
  width: 100%;
  height: 100%;
  position: relative;
  border-radius: 16px;
  overflow: hidden;
}

.video-thumbnail-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 16px;
}

/* Overlay escuro */
.video-overlay {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s;
}

/* Seta SVG centralizada */
.play-button {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.video-thumbnail:hover .video-overlay {
  background: rgba(0, 0, 0, 0.6);
}

.video-thumbnail:hover .play-triangle {
  width: 96px;
  height: 96px;
}

.play-triangle {
  width: 60px;
  height: 60px;
  display: block;
  fill: map-get($primary-fade, 50);
  transition: width 0.2s, height 0.2s;
}

.video-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  position: relative;
  width: 80%;
  max-width: 1200px;
  background-color: black;
  aspect-ratio: 16 / 9;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content iframe {
  width: 100%;
  height: 100%;
  border: none;
}

.close-button {
  position: absolute;
  top: -40px;
  right: 0;
  background: none;
  border: none;
  color: white;
  font-size: 30px;
  cursor: pointer;
  padding: 5px;
}

.close-button:hover {
  color: #ccc;
}
</style>
