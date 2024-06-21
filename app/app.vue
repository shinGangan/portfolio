<script setup lang="ts">
const { getImages } = useFile();

useHead({
  link: [{ rel: 'icon', href: '/favicon.ico' }],
  htmlAttrs: {
    lang: 'ja'
  }
});

const { title, description } = useAppConfig();

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description,
  ogSiteName: title,
  // TODO: Change the OG Image
  ogImage: 'https://image-gallery.nuxt.dev/social-card.png',
  twitterCard: 'summary_large_image'
});

await getImages();
</script>

<template>
  <div
    class="bg-black min-h-[100dvh] overflow-x-auto relative"
    :class="{
      'flex flex-col md:block': $router.currentRoute.value.fullPath !== '/'
    }"
  >
    <UNotifications />
    <NuxtPage />
    <ImageThumbnailList
      :class="
        $router.currentRoute.value.fullPath !== '/'
          ? 'opacity-100 z-[9999]'
          : 'opacity-0 z-[-1]'
      "
    />
  </div>
</template>
