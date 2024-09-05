// tests/unit/Home.spec.js
import { shallowMount } from '@vue/test-utils';
import Home from '@/components/Home.vue';

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve([
        { id: 1, url: 'https://via.placeholder.com/150', title: 'Image 1' },
        { id: 2, url: 'https://via.placeholder.com/150', title: 'Image 2' }
      ])
  })
);

describe('Home.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(Home, {
      data() {
        return {
          images: [],
          loading: false,
          page: 1,
          limit: 10
        };
      }
    });
  });

  afterEach(() => {
    global.fetch.mockClear();
    wrapper.vm.images = [];
  });

  it('should mount correctly', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('should load images on mount', async () => {
    await wrapper.vm.loadImages();
    expect(wrapper.vm.images.length).toEqual(2);
  });

  it('should remove an image on click', async () => {
    await wrapper.vm.loadImages();

    wrapper.vm.remove({ target: { id: '1' } });

    expect(wrapper.vm.images.length).toEqual(1);
    expect(wrapper.vm.images[0].id).toBe(2);
  });
});
