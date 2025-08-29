import { defineConfig, loadEnv } from 'vite'
import { VERSION } from './version.js'

export default defineConfig(({ mode }) => {
    const publicEnv = loadEnv('public', process.cwd(), '')
    const privateEnv = loadEnv('private', process.cwd(), '')
    
    let gameMode = 'click'
    let gameType = 'scratch'
    
    if (mode && mode !== 'development') {
        const parts = mode.split('-')
        if (parts.length >= 2) {
            gameType = parts[0] // scratch-click -> scratch, wheel-auto -> wheel
            gameMode = parts[1] // scratch-click -> click, wheel-auto -> auto
        }
    }
    
    const currentSettings = {
        VITE_GAME_MODE: gameMode,
        VITE_GAME_TYPE: gameType
    }
    
    const mergedEnv = { ...publicEnv, ...privateEnv, ...currentSettings }
    
    return {
        base: './',
        server: {
            open: true,
            port: 5173
        },
        resolve: {
            alias: {
                '@': '/src',
                '@assets': '/assets',
                '@images': '/assets/images',
                '@js': '/js',
                '@css': '/styles'
            }
        },
        build: {
            outDir: mode === 'scratch-click' ? 'dist/scratch-click' :
                    mode === 'scratch-auto' ? 'dist/scratch-auto' :
                    mode === 'wheel-click' ? 'dist/wheel-click' :
                    mode === 'wheel-auto' ? 'dist/wheel-auto' : 'dist',
            assetsDir: 'assets',
            cssCodeSplit: true,
            cssMinify: true,
            rollupOptions: {
                input: {
                    main: '/index.html'
                },
                output: {
                    assetFileNames: (assetInfo) => {
                        let extType = assetInfo.name.split('.')[1];
                        if (/png|jpe?g|svg|gif|tiff|bmp|ico|webp/i.test(extType)) {
                            return `assets/images/[name]-${VERSION}-[hash][extname]`;
                        }
                        return `assets/${extType}/[name]-${VERSION}-[hash][extname]`;
                    },
                    chunkFileNames: `assets/js/[name]-${VERSION}-[hash].js`,
                    entryFileNames: `assets/js/[name]-${VERSION}-[hash].js`
                }
            }
        },
        css: {
            devSourcemap: true
        },
        define: {
            __APP_VERSION__: JSON.stringify(VERSION),
            ...Object.keys(mergedEnv).reduce((prev, key) => {
                if (key.startsWith('VITE_')) {
                    prev[`import.meta.env.${key}`] = JSON.stringify(mergedEnv[key])
                }
                return prev
            }, {})
        }
    }
})