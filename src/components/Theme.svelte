<svelte:head>
<!-- SMUI Styles -->
<link rel="stylesheet" href="/smui.css" />

<!-- Hint where we get fonts from. -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />

<!-- Material Icons, Roboto, and Roboto Mono fonts -->
<link
        href="https://fonts.googleapis.com/css2?family=Material+Icons&Roboto+Mono:ital@0;1&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
        rel="stylesheet"
/>
</svelte:head>

<!--styleタグは svelte:headの中に入れてはいけない。-->>
<style>
  /* ブラウザ標準のカレンダーアイコンを強制的に表示させる */
  :global(input[type="date"]::-webkit-calendar-picker-indicator) {
    /* 隠されているものを表示する */
    display: block !important;
    opacity: 1 !important;
    
    position: absolute; /*親要素のinputを基準とする*/
    right: 8px;
    top: 50%;      /* 上下中央へ */
    transform: translateY(-50%); /* 中央寄せの微調整 */
    z-index: 10; /* 数値が大きいほど前面 */
    cursor: pointer;
    
    /* デフォルトは 10pxぐらいで少し小さい */
    width: 20px;
    height: 20px;
  }
</style>