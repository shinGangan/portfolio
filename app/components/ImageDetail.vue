<script setup lang="ts">
const bottomMenu = ref();
const imageEl = ref<HTMLImageElement>();
const magnifierEl = ref<HTMLElement>();
const imageContainer = ref<HTMLElement>();
const savingImg = ref(false);

// filter
// TODO: filter = description になる
const filter = ref(false);
const contrast = ref(100);
const blur = ref(0);
const hueRotate = ref(0);
const invert = ref(0);
const saturate = ref(100);
const sepia = ref(0);
const magnifier = ref(false);
const zoomFactor = ref(1);
const objectsFit = ref(['Contain', 'Cover', 'Scale-down', 'Fill', 'None']);
const objectFitSelected = ref(objectsFit.value[0]);
const filterUpdated = ref(false);

const { images, uploadImage } = useFile();
const { loggedIn } = useUserSession();

const isSmallScreen = useMediaQuery('(max-width: 1024px)');
const { currentIndex, isFirstImg, isLastImg, applyFilters, initSwipe, convertBase64ToFile, magnifierImage } = useImageGallery();

const active = useState();
const route = useRoute();
const router = useRouter();

const image = computed(() => {
  return images.value!.filter((file: BlobObject) => file.pathname.split('.')[0] === route.params.slug[0])[0];
});

onKeyStroke('Escape', () => {
  router.push('/');
});

onKeyStroke('ArrowLeft', () => {
  if (isFirstImg.value)
    router.push('/');
  else
    router.push(`/detail/${images.value![currentIndex.value - 1].pathname.split('.')[0]}`);
});

onKeyStroke('ArrowRight', () => {
  if (isLastImg.value)
    router.push('/');
  else
    router.push(`/detail/${images.value![currentIndex.value + 1].pathname.split('.')[0]}`);
});

function resetFilter() {
  contrast.value = 100;
  blur.value = 0;
  invert.value = 0;
  saturate.value = 100;
  hueRotate.value = 0;
  sepia.value = 0;
  filterUpdated.value = false;
  magnifier.value = false;
  zoomFactor.value = 1;
}

function cancelFilter() {
  filter.value = false;

  resetFilter();
}

async function saveImage() {
  if (filterUpdated.value && imageEl.value) {
    savingImg.value = true;

    const modifiedImage = await applyFilters(imageEl.value, contrast.value, blur.value, invert.value, saturate.value, hueRotate.value, sepia.value);

    const imageToUpload = await convertBase64ToFile(modifiedImage, image);

    await uploadImage(imageToUpload, true).finally(() => savingImg.value = false);
  }
}

watch([contrast, blur, invert, saturate, hueRotate, sepia], () => {
  filterUpdated.value = true;
});

onMounted(() => {
  initSwipe(imageEl);
});

/**
 * NOTE: details ではsummary、descriptionを表示する.
 * TODO: summary, description, link はR2にjsonを置いたり、API的に一覧を取得したい
 */
const summary = ref<string>('Product Summary');
const description = ref<string>('これはテストの説明文です。\n\
2024年初めからNuxtのコントリビューターとして活動しています。');
const link = ref<string>('https://nuxters.nuxt.com/shinGangan');
const badge = ref<string[]>(['Product']);
</script>

<template>
  <div v-if="image">
    <!-- background -->
    <div class="absolute inset-0 w-full h-full">
      <img
        :src="`/images/${image.pathname}`"
        class="object-cover w-full h-full blur-[70px] brightness-[.2] will-change-[filter]"
        alt=""
      >
    </div>

    <UContainer class="overflow-x-hidden relative flex items-center justify-center">
      <ImageFilters
        class="absolute md:mt-36 transition-transform duration-200"
        :class="filter ? 'translate-x-0 right-8 ' : 'translate-x-full right-0'"
        @reset-filter="resetFilter"
        @close-filter="filter = false"
      >
        <div
          class="flex flex-col gap-y-12 pb-6 h-[60dvh]"
          :class="filter ? 'block opacity-100' : 'hidden opacity-0'"
        >
          <div class="flex flex-col gap-y-4 text-white">
            {{ description }}
          </div>
        </div>
      </ImageFilters>

      <div class="h-full w-full max-w-7xl flex items-center justify-center relative mx-auto">
        <!-- Bottom menu -->
        <BottomMenu
          ref="bottomMenu"
          class="bottom-menu"
          :class="{ 'right-[350px]': filter }"
        >
          <template #logo>
            <UBadge
              v-for="b in badge"
              :key="b"
              :ui="{ rounded: 'rounded-full' }"
              color="green"
              :label="b"
            />
          </template>
          <template #description>
            <p class="bottom-menu-description">
              {{ summary }}
            </p>
          </template>
          <!-- Filters -->
          <template #buttons>
            <div class="bottom-menu-button">
              <div
                v-if="!filter"
                class="flex gap-x-2 items-center"
              >
                <!-- back to gallery (desktop & not the first or last image) -->
                <UTooltip
                  v-if="!(isFirstImg || isLastImg) || isSmallScreen"
                  text="Back to gallery"
                  :shortcuts="['Esc']"
                >
                  <UButton
                    variant="ghost"
                    color="gray"
                    to="/"
                    size="md"
                    icon="i-heroicons-rectangle-group-20-solid"
                    aria-label="Back to gallery"
                    class="back flex transition-colors duration-200"
                  />
                </UTooltip>
                <!-- open description -->
                <!-- v-if="loggedIn"  -->
                <UTooltip text="Show description">
                  <UButton
                    variant="ghost"
                    color="gray"
                    size="md"
                    icon="i-heroicons-chevron-double-right-20-solid"
                    aria-label="Show product description"
                    class="hidden lg:flex"
                    @click="filter = true"
                  />
                </UTooltip>
                <!-- open original -->
                <UTooltip text="Go to product page">
                  <UButton
                    variant="ghost"
                    color="gray"
                    icon="i-heroicons-arrow-up-right-20-solid"
                    size="md"
                    :to="link"
                    target="_blank"
                    aria-label="Go to product page"
                  />
                </UTooltip>
              </div>

              <div
                v-else
                class="flex gap-x-2 items-center"
              >
                <UTooltip
                  v-if="loggedIn"
                  text="Save filtered image"
                >
                  <UButton
                    :loading="savingImg"
                    variant="ghost"
                    color="gray"
                    icon="i-heroicons-check-20-solid"
                    class="hidden md:flex"
                    aria-label="Upload original or modified image to gallery"
                    @click="saveImage()"
                  />
                </UTooltip>
                <UTooltip text="Cancel filters">
                  <UButton
                    variant="ghost"
                    color="gray"
                    icon="i-heroicons-x-mark"
                    class="hidden md:flex"
                    aria-label="Upload original or modified image to gallery"
                    @click="cancelFilter()"
                  />
                </UTooltip>
              </div>
            </div>
          </template>
        </BottomMenu>

        <div
          :class="{ '-translate-x-[100px]': filter }"
          class="transition-all duration-200 overflow-hidden pt-8 flex items-center justify-center w-full h-screen relative"
        >
          <div class="flex items-center justify-center md:justify-between gap-x-4 w-full">
            <!-- previous image if not the first image -->
            <UTooltip
              v-if="!isFirstImg"
              text="Previous"
              :shortcuts="['←']"
            >
              <UButton
                variant="ghost"
                color="gray"
                :to="`/detail/${images![currentIndex - 1].pathname.split('.')[0]}`"
                size="lg"
                icon="i-heroicons-chevron-left"
                class="hidden md:flex ml-4"
                aria-label="Go to previous image"
                @click="active === image.pathname.split('.')[0]"
              />
            </UTooltip>

            <div
              v-else
              class="flex group"
            >
              <!-- back to gallery if first movie -->
              <UTooltip
                text="Back to gallery"
                :shortcuts="['Esc']"
              >
                <UButton
                  to="/"
                  size="xl"
                  color="gray"
                  variant="ghost"
                  class="back hidden md:flex ml-4 transition-colors duration-200"
                  aria-label="Back to gallery"
                  @click="active === image.pathname.split('.')[0]"
                >
                  <UIcon
                    name="i-heroicons-rectangle-group-20-solid"
                    class="w-6 h-6"
                  />
                </UButton>
              </UTooltip>
            </div>

            <!-- image -->
            <div class="relative flex items-center justify-center xl:m-16">
              <div ref="imageContainer">
                <div class="group">
                  <img
                    v-if="image"
                    ref="imageEl"
                    :src="`/images/${image.pathname}`"
                    :alt="image.pathname"
                    class="rounded object-contain transition-all duration-200 block"
                    :class="[{ imageEl: route.params.slug[0] === image.pathname.split('.')[0] }, filter ? 'w-[80%] ml-[12px]' : 'w-full']"
                    :style="`filter: contrast(${contrast}%) blur(${blur}px) invert(${invert}%) saturate(${saturate}%) hue-rotate(${hueRotate}deg) sepia(${sepia}%); object-fit:${objectFitSelected.toLowerCase()};`"
                    crossorigin="anonymous"
                    @mousemove="magnifier ? magnifierImage($event, imageContainer, imageEl, magnifierEl!, zoomFactor) : () => {}"
                  >
                  <div
                    v-if="magnifier"
                    ref="magnifierEl"
                    class="w-[100px] h-[100px] absolute border border-gray-200 pointer-events-none rounded-full block opacity-0 group-hover:opacity-100 transition-opacity duration-200 "
                    :style="`background-image: url('/images/${image.pathname}'`"
                  />
                </div>
              </div>
            </div>

            <!-- next image (if not the last image) -->
            <UTooltip
              v-if="!isLastImg"
              text="Next"
              :shortcuts="['→']"
            >
              <UButton
                variant="ghost"
                color="gray"
                :to="`/detail/${images![currentIndex + 1].pathname.split('.')[0]}`"
                size="lg"
                icon="i-heroicons-chevron-right"
                :ui="{ rounded: 'rounded-full' }"
                class="hidden md:flex mr-4"
                aria-label="Go to next image"
                @click="active === image.pathname.split('.')[0]"
              />
            </UTooltip>

            <!-- back to gallery if last image -->
            <UTooltip
              v-else
              text="Back to gallery"
              :shortcuts="['Esc']"
            >
              <div class="flex">
                <UButton
                  variant="ghost"
                  color="gray"
                  to="/"
                  size="xl"
                  class="back hidden md:flex mr-4 transition-colors duration-200"
                  aria-label="Back to gallery"
                  @click="active === image.pathname.split('.')[0]"
                >
                  <UIcon
                    name="i-heroicons-rectangle-group-20-solid"
                    class="w-6 h-6"
                  />
                </UButton>
              </div>
            </UTooltip>
          </div>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<style scoped lang="postcss">
@media (min-width: 768px) {
  .imageEl {
    view-transition-name: vtn-image;
  }

  .bottom-menu {
    view-transition-name: vtn-bottom-menu;
  }

  .bottom-menu-description {
    view-transition-name: vtn-bottom-menu-description;
  }

  .bottom-menu-button {
    view-transition-name: vtn-bottom-menu-button;
  }

  .back {
    view-transition-name: vtn-back-button;
  }
}
</style>

<style>
@keyframes slide-to-left {
  to {
    transform: translateX(0px);
  }
}

::view-transition-old(vtn-bottom-menu-description) {
  animation: 300ms cubic-bezier(0.4, 0, 0.2, 1) both slide-to-left;
  width: auto;
  opacity: 0;
}
</style>
