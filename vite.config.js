import {
	defineConfig,
	loadEnv
} from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import vuetify from 'vite-plugin-vuetify'
import viteCompression from 'vite-plugin-compression'
// import vitePluginAppinfo from 'vite-plugin-build-gitinfo'
// import legacy from '@vitejs/plugin-legacy'

const mode = 'development'
const env = loadEnv(mode, './')

// https://vitejs.dev/config/
export default defineConfig({
	server: {
		proxy: {
			'/api': {
				target: env.VITE_PROXY_URL || '',
				changeOrigin: true,
				secure: false,  // 如果是https接口，需要配置这个参数  
			}
		},
		cors: true
	},
	resolve: {
		alias: {
			'~': path.resolve(__dirname, './'),
			'@': path.resolve(__dirname, 'src')
		}
	},
	css: {
		//css预处理
		preprocessorOptions: {
			scss: {}
		}
	},
	plugins: [
		// vitePluginAppinfo({
		// 	enableGlobal: true
		// }),
		vue(),
		viteCompression({
			verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: 'gzip',
      ext: '.gz',
		}),
		// legacy({
    //   targets: ['defaults', 'not IE 11'],
		// 	additionalLegacyPolyfills: ['regenerator-runtime/runtime']
    // }),
		vuetify({
			autoImport: true
		}),
	],
	build: {
		assetsInlineLimit: 4096,
		rollupOptions: {
			input: 'index.html',
			output: {
				chunkFileNames: 'assets/js/[name]-[hash].js',
				entryFileNames: 'assets/js/[name]-[hash].js',
				assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
				manualChunks(id) {
					if (id.includes('node_modules')) {
						return id.toString().split('node_modules/')[1].split('/')[0].toString()
					}
				}
			}
		},
		chunkSizeWarningLimit: 1000,
		minify: 'terser',
		terserOptions: {
			compress: {
				drop_console: true,
				drop_debugger: true,
			}
		},
		sourcemap: false
	}
})
