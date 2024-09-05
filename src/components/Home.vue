<template>
  <div>
    <h1>Select the color you want to remove</h1>
    <div class="scroll-container" @scroll="onScroll" ref="scrollContainer">
      <TransitionGroup name="fade" tag="div" class="images-grid">
        <div class="image-item" v-for="image in images" :key="image.id">
          <img :src="image.url" :alt="image.title" :id="image.id" @click="remove"/>
        </div>
        <div v-if="loading" class="loading-spinner">Loading...</div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ImagesGrid',
    
    data() {
      return {
        images: [], //save the images
        loading: false,
        page: 1,
        limit: 10
      };
    },

    async beforeMount() {
      try {
        await this.loadImages();
        this.$refs.scrollContainer.addEventListener('scroll', this.onScroll);
      } catch (error) {
        console.error('Error in beforeMount hook:', error);
      }
    },

    methods: {
      async loadImages() {
        if (this.loading) return;
        this.loading = true;

        try {
          const response = await fetch(`https://jsonplaceholder.typicode.com/photos?_limit=${this.limit}&_page=${this.page}`);
          if (!response.ok) throw new Error('Network response was not ok');

          const data = await response.json();

          // Filter duplicate images
          const uniqueImages = data.filter((newImage) => {
            return !this.images.some((existingImage) => existingImage.id === newImage.id);
          });

          if (uniqueImages.length) {
            this.images.push(...uniqueImages);
            this.page++;
          }
        } catch (error) {
          console.error('Error loading images:', error);
        } finally {
          this.loading = false;
        }
      },

      onScroll() {
        if (this.debouncedScroll) return;
        this.debouncedScroll = true;

        setTimeout(() => {
          const scrollContainer = this.$refs.scrollContainer;
          const scrollTop = scrollContainer.scrollTop;
          const scrollHeight = scrollContainer.scrollHeight;
          const clientHeight = scrollContainer.clientHeight;

          if (scrollTop + clientHeight >= scrollHeight) {
            this.loadImages();
          }

          this.debouncedScroll = false;
        }, 200); 
      },

      remove(e) {
        const idImage = parseInt(e.target.id);
        
        //Find image index to remove from the array
        const index = this.images.findIndex((image) => image.id === idImage);
        this.images.splice(index, 1);

        if (this.images.length < 10) this.loadImages();
      }
    }
  }
</script>

<style scoped>
  .scroll-container {
    overflow-y: auto;
    height: 100vh;
  }

  .images-grid {
    display: grid;
    gap: 0;
    grid-template-columns: repeat(2, 1fr);
    position: relative;
    height: 100vh;
    grid-auto-flow: dense;
    gap: 10px
  }
  
  @media (min-width: 640px) {
    .images-grid {
      grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
    }
  }

  /* Transitions*/
  .fade-move {
    transition: transform 0.3s ease-in-out;
    will-change: transform; 
  }
  .fade-enter-active {
    transition: all 2s cubic-bezier(0.55, 0, 0.1, 1);
  }
  .fade-leave-active {
    transition: all 0.8s cubic-bezier(0.55, 0, 0.1, 1);
  }

  .fade-enter-from {
    opacity: 0;
    transform: scaleY(0.01) translate(30px, 0);
  }
  .fade-leave-to {
    opacity: 0;
    transform: scaleY(0.01) translate(-30px, 0);
  }

  .fade-leave-active {
    position: absolute;
    width: 100%;
  }

  .image-item {
    height: 100%;
    width: 100%;
    cursor: pointer;
    background-color: transparent;
    position: relative;
  }

  .image-item:hover {
    height: 101%;
    width: 101%;
    z-index: 100;
  }

  .image-item > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .loading-spinner {
    text-align: center;
    padding: 20px;
  }
</style>