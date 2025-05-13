<template>
  <div class="midia-wrapper">
    <!-- Image handling -->
    <img
      v-if="typeMidia === 'image'"
      :src="link"
      :alt="'Imagem'"
      class="midia-image"
    />

    <!-- Video handling -->
    <div v-else-if="typeMidia === 'video'" class="video-container">
      <div class="video-thumbnail" @click="openVideoModal">
        <img
          :src="getVideoThumbnail(link)"
          alt="Video thumbnail"
          class="video-thumbnail-img"
        />
        <div class="play-button">
          <i class="fas fa-play"></i>
        </div>
      </div>
    </div>

    <!-- Video Modal -->
    <div v-if="showVideoModal" class="video-modal" @click="closeVideoModal">
      <div class="modal-content" @click.stop>
        <button class="close-button" @click="closeVideoModal">&times;</button>
        <iframe
          :src="getEmbedUrl(link)"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>
    </div>
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
    link: {
      type: String,
      required: true
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
      // Extract video ID from YouTube URL
      const videoId = this.extractVideoId(url);

      return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
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

<style scoped>
.midia-wrapper {
  display: flex;
  padding: 16px 24px;
  width: 100%;
  height: auto;
  align-items: center;
  justify-content: center;
}

.midia-image {
  max-width: 280px;
  max-height: 280px;
  width: 100%;
  height: auto;
  object-fit: contain;
}

.video-container {
  width: 320px;
  height: 180px;
  position: relative;
  cursor: pointer;
}

.video-thumbnail {
  width: 100%;
  height: 100%;
  position: relative;
}

.video-thumbnail-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.play-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
}

.video-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  position: relative;
  width: 80%;
  max-width: 800px;
  background-color: black;
}

.modal-content iframe {
  width: 100%;
  height: 450px;
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
