<template>
    <div class="container main-menu">
        <header class="hero">
            <h1>
                <T textKey="menu.title" />
            </h1>
            <img class="hero-banner" src="/stacky-bird.gif" alt="Stacky Bird banner" />
            <p class="subtitle">
                <T textKey="menu.subtitle" />
            </p>
            <p class="game-description">
                <span v-html="gameDescriptionHtml"></span>
            </p>
            <p class="age-note">
                <T textKey="menu.ageNote" />
            </p>
            <button class="primary-btn demo-cta" type="button" @click="openDemoVideo">
                <i class="bi-play-circle-fill" aria-hidden="true"></i>
                <T textKey="menu.demoVideoCta" />
            </button>
            <p class="scroll-hint">
                <T textKey="menu.scrollHint" />
            </p>
            <p class="meta-info">
                <T textKey="menu.metaInfo" />{{ ' ' }} <a href="https://waleson.com">waleson.com</a
                >{{ ' ' }}
                <T textKey="menu.metaInfoEnd" />
            </p>
            <p class="github-link">
                <a
                    href="https://github.com/jtwaleson/stacky-bird"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <i class="bi-github" aria-hidden="true"></i>
                    <T textKey="menu.githubLink" />
                </a>
            </p>
            <p class="desktop-warning">
                <T textKey="menu.bestOnDesktopWarning" />
            </p>
        </header>

        <vue-final-modal
            v-model="showDemoVideoModal"
            classes="modal-container demo-modal-container"
            content-class="modal-content demo-modal-content"
        >
            <div class="demo-modal">
                <div class="demo-modal__header">
                    <h2 class="demo-modal__title">
                        <T textKey="menu.demoVideoTitle" />
                    </h2>
                    <button class="demo-modal__close" type="button" @click="closeDemoVideo">
                        <span class="sr-only">
                            <T textKey="menu.close" />
                        </span>
                        <i class="bi-x-lg" aria-hidden="true"></i>
                    </button>
                </div>
                <div class="demo-modal__body">
                    <video
                        ref="demoVideoEl"
                        class="demo-modal__video"
                        controls
                        preload="metadata"
                        playsinline
                        src="/stacky-bird-demo.mp4"
                    >
                        Sorry, your browser doesn’t support embedded videos. You can download it
                        here:
                        <a href="/stacky-bird-demo.mp4">stacky-bird-demo.mp4</a>
                    </video>
                </div>
            </div>
        </vue-final-modal>

        <section class="languages">
            <h2>
                <T textKey="menu.language" />
            </h2>
            <div class="language-options">
                <button
                    v-for="(caption, languageCode) in store.languages"
                    :key="languageCode"
                    @click="store.setLanguage(languageCode)"
                    class="lang-btn"
                    :class="{ active: store.locale === languageCode }"
                >
                    {{ caption }}
                </button>
            </div>
        </section>

        <section class="levels-section">
            <h2>
                <T textKey="menu.levels" />
            </h2>
            <p v-if="store.availableLevels.length > 0">
                <T textKey="menu.levelsDescription" />
            </p>
            <p v-else>
                <T textKey="menu.allLevelsFinished" />
            </p>

            <div class="level-list-container">
                <LevelList :levels="store.availableLevels" />
            </div>

            <p v-if="hiddenLevelCount > 0" class="hidden-count">
                <i>
                    <T textKey="menu.hiddenLevelsCount" :replacements="{ hiddenLevelCount }" />
                </i>
            </p>
        </section>

        <section class="instructions-section">
            <h2>
                <T textKey="menu.instructionBlocks" />
            </h2>
            <p>
                <T textKey="menu.instructionBlocksDescription" />
            </p>
            <div class="instruction-list-wrapper">
                <InstructionList />
            </div>
            <p class="hidden-count">
                <T
                    textKey="menu.hiddenInstructionsCount"
                    :replacements="{ hiddenInstructionCount }"
                />
            </p>
        </section>

        <section class="completed-section">
            <h2>
                <T textKey="menu.completedLevels" /> ({{ store.completedLevels.length }} /
                {{ Object.keys(store.levels).length }})
            </h2>
            <p v-if="store.completedLevels.length === 0">
                <T textKey="menu.noLevelsFinished" />
            </p>
            <LevelList v-else :levels="store.completedLevels" />
        </section>

        <footer class="footer">
            <a href="#" class="reset-link" @click.prevent="factoryReset">
                <T textKey="menu.resetGame" />
            </a>
        </footer>
    </div>
</template>
<script setup lang="ts">
import { computed, getCurrentInstance, nextTick, ref, watch } from 'vue'
import { useStore } from '../store'
import InstructionList from './InstructionList.vue'
import LevelList from './LevelList.vue'

const store = useStore()
const instance = getCurrentInstance()
const showDemoVideoModal = ref(false)
const demoVideoEl = ref<HTMLVideoElement | null>(null)

const hiddenLevelCount = computed(() => {
    return (
        Object.keys(store.levels).length -
        (store.completedLevels.length + store.availableLevels.length)
    )
})

const hiddenInstructionCount = computed(() => {
    return Object.keys(store.instructions).length - store.availableInstructions.length
})

const gameDescriptionHtml = computed(() => {
    // Make reactive to locale changes
    void store.locale

    const $t = instance?.proxy?.$t
    if ($t) {
        return $t('menu.gameDescriptionHtml')
    }
    return 'menu.gameDescriptionHtml'
})

const openDemoVideo = async () => {
    showDemoVideoModal.value = true
    await nextTick()
    // Autoplay in the popup (this runs after a user click, so it's usually allowed).
    if (demoVideoEl.value) {
        demoVideoEl.value.currentTime = 0
        const playPromise = demoVideoEl.value.play()
        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(() => {
                // Autoplay can still be blocked on some browsers; controls remain available.
            })
        }
    }
}

const closeDemoVideo = () => {
    showDemoVideoModal.value = false
}

watch(showDemoVideoModal, (isOpen) => {
    if (!isOpen && demoVideoEl.value) {
        demoVideoEl.value.pause()
        demoVideoEl.value.currentTime = 0
    }
})

const factoryReset = () => {
    const $tr = instance?.proxy?.$tr
    const confirmMessage = $tr ? $tr('menu.resetConfirm') : 'menu.resetConfirm'
    if (confirm(confirmMessage)) {
        const alertMessage = $tr ? $tr('menu.resetComplete') : 'menu.resetComplete'
        alert(alertMessage)
        localStorage.clear()
        window.location.reload()
    }
}
</script>
<style scoped>
.main-menu {
    padding-bottom: 50px;
    min-height: 100vh;
}

.hero {
    margin-bottom: 40px;
    text-align: center;
}

.hero-banner {
    display: block;
    max-width: 50rem;
    height: 160px;
    margin: 12px auto 0;
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-sm);
    background: #000;
}

@media (max-width: 600px) {
    .hero-banner {
        height: 120px;
        border-radius: 0;
        margin-left: calc(var(--spacing-md) * -1);
        margin-right: calc(var(--spacing-md) * -1);
        width: calc(100% + (var(--spacing-md) * 2));
        max-width: none;
    }
}

.subtitle {
    font-size: 1.2rem;
    color: var(--heading-color);
}

.game-description {
    max-width: 60rem;
    margin: 16px auto 0;
    line-height: 1.5;
    text-align: left;
}

.game-description :deep(.opcode-pill) {
    display: inline-block;
    padding: 2px 10px;
    margin: 0 2px;
    border-radius: 999px;
    border: 1px solid var(--border-color);
    background: rgba(255, 255, 255, 0.7);
    font-family:
        ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
        monospace;
    font-size: 0.95em;
    letter-spacing: 0.03em;
    white-space: nowrap;
}

.age-note {
    max-width: 60rem;
    margin: 12px auto 0;
    color: var(--text-light);
    font-size: 0.98rem;
    text-align: left;
}

.desktop-warning {
    max-width: 60rem;
    margin: 14px auto 0;
    color: var(--danger-color);
    font-weight: 600;
    text-align: left;
}

.github-link {
    max-width: 60rem;
    margin: 12px auto 0;
    text-align: left;
}

.github-link a {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--text-color);
    text-decoration: none;
    font-weight: normal;
}

.github-link a:hover {
    text-decoration: underline;
}

.github-link i {
    font-size: 1.1em;
}

.demo-cta {
    margin-top: 10px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    font-size: 1.1rem;
    box-shadow: var(--shadow-md);
}

.demo-cta i {
    font-size: 1.2em;
}

.scroll-hint {
    margin-top: 8px;
    color: var(--text-light);
    font-size: 0.95rem;
    font-style: italic;
}

.meta-info {
    font-size: 0.9rem;
    color: var(--text-light);
}

/* Screen-reader only */
.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
}

/* Demo modal (mobile-first) */
:deep(.demo-modal-content) {
    width: 100%;
    max-width: 60rem;
}

.demo-modal {
    width: 100%;
    background: white;
    border-radius: var(--radius-md);
    overflow: hidden;
    box-shadow: var(--shadow-sm);
}

.demo-modal__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 12px;
    border-bottom: 1px solid var(--border-color);
}

.demo-modal__title {
    margin: 0;
    font-size: 1rem;
}

.demo-modal__close {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border-radius: 999px;
    border: 1px solid var(--border-color);
    background: white;
}

.demo-modal__body {
    padding: 12px;
}

.demo-modal__video {
    width: 100%;
    border-radius: var(--radius-md);
    background: #000;
}

@media (max-width: 600px) {
    .demo-cta {
        width: 100%;
    }

    :deep(.demo-modal-content) {
        max-width: 100%;
        margin: 0;
        max-height: 100%;
    }

    .demo-modal {
        height: 100vh;
        border-radius: 0;
    }

    .demo-modal__body {
        padding: 12px;
        overflow: auto;
    }
}

.language-options {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
}

.lang-btn {
    background: white;
    border: 1px solid var(--border-color);
    color: var(--text-color);
    padding: 8px 16px;
    border-radius: 20px;
    transition: all 0.2s;
}

.lang-btn:hover {
    background: var(--bg-color);
    border-color: var(--primary-color);
}

.lang-btn.active {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
}

.levels-section,
.instructions-section,
.completed-section {
    margin-bottom: 40px;
}

.instruction-list-wrapper {
    background: #e0d8d0;
    /* Slightly darker than page bg */
    padding: 20px;
    border-radius: var(--radius-md);
    width: 100%;
    overflow: hidden;
    /* Since InstructionList is grid */
}

.hidden-count {
    margin-top: 10px;
    color: var(--text-light);
}

.footer {
    margin-top: 60px;
    text-align: center;
    border-top: 1px solid var(--border-color);
    padding-top: 20px;
}

.reset-link {
    color: var(--danger-color);
    font-size: 0.8rem;
    opacity: 0.7;
}

.reset-link:hover {
    opacity: 1;
}
</style>
