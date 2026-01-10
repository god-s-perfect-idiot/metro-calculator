<script>
  import { onMount } from "svelte";
  import CalculatorPage from "./pages/CalculatorPage.svelte";
  import { App as CapacitorApp } from "@capacitor/app";

  let mounted = false;

  onMount(() => {
    mounted = true;
    
    // Initialize Capacitor plugins
    async function initCapacitor() {
      try {
        CapacitorApp.addListener('backButton', ({ canGoBack }) => {
          if (!canGoBack) {
            CapacitorApp.exitApp();
          } else {
            window.history.back();
          }
        });
      } catch (error) {
        console.log('Capacitor not available (running in browser)', error);
      }
    }
    
    initCapacitor();
  });
</script>

<main class="w-full h-full relative">
  <div class="page-holder">
    <div class="page" class:flip-in={mounted}>
      <CalculatorPage />
    </div>
  </div>
</main>

<style>
  .page-holder {
    perspective: 1000px;
    perspective-origin: center center;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
  }
  
  .page {
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    transform-origin: left center;
    transform: rotateY(90deg);
    opacity: 0;
  }
  
  .page.flip-in {
    animation: flipIn 0.3s ease-out forwards;
  }
  
  @keyframes flipIn {
    from {
      transform: rotateY(90deg);
      opacity: 0;
    }
    to {
      transform: rotateY(0deg);
      opacity: 1;
    }
  }
</style>
