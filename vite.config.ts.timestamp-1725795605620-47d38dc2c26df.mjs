// vite.config.ts
import { defineConfig } from 'file:///C:/Users/AdolphusOkrah/Desktop/my-stuffs/visio-cms-lib/node_modules/vite/dist/node/index.js';
import react from 'file:///C:/Users/AdolphusOkrah/Desktop/my-stuffs/visio-cms-lib/node_modules/@vitejs/plugin-react-swc/index.mjs';
import path from 'path';
import dts from 'file:///C:/Users/AdolphusOkrah/Desktop/my-stuffs/visio-cms-lib/node_modules/vite-plugin-dts/dist/index.mjs';
var __vite_injected_original_dirname = 'C:\\Users\\AdolphusOkrah\\Desktop\\my-stuffs\\visio-cms-lib';
var vite_config_default = defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: {
        main: path.resolve(__vite_injected_original_dirname, 'src/components/index.ts'),
        exposedFunctions: path.resolve(__vite_injected_original_dirname, 'src/lib/exposed-functions.ts'),
      },
      name: 'visio-cms',
      formats: ['es'],
      fileName: (format) => `[name].${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
        inlineDynamicImports: false,
        preserveModules: true,
        preserveModulesRoot: 'src',
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__vite_injected_original_dirname, './src'),
    },
  },
});
export { vite_config_default as default };
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxBZG9scGh1c09rcmFoXFxcXERlc2t0b3BcXFxcbXktc3R1ZmZzXFxcXHZpc2lvLWNtcy1saWJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXEFkb2xwaHVzT2tyYWhcXFxcRGVza3RvcFxcXFxteS1zdHVmZnNcXFxcdmlzaW8tY21zLWxpYlxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvQWRvbHBodXNPa3JhaC9EZXNrdG9wL215LXN0dWZmcy92aXNpby1jbXMtbGliL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XHJcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2MnO1xyXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcclxuaW1wb3J0IGR0cyBmcm9tICd2aXRlLXBsdWdpbi1kdHMnO1xyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBwbHVnaW5zOiBbXHJcbiAgICByZWFjdCgpLFxyXG4gICAgZHRzKHtcclxuICAgICAgaW5zZXJ0VHlwZXNFbnRyeTogdHJ1ZSxcclxuICAgIH0pLFxyXG4gIF0sXHJcbiAgYnVpbGQ6IHtcclxuICAgIGxpYjoge1xyXG4gICAgICBlbnRyeToge1xyXG4gICAgICAgIG1haW46IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvY29tcG9uZW50cy9pbmRleC50cycpLFxyXG4gICAgICAgIGV4cG9zZWRGdW5jdGlvbnM6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvbGliL2V4cG9zZWQtZnVuY3Rpb25zLnRzJyksXHJcbiAgICAgIH0sXHJcbiAgICAgIG5hbWU6ICd2aXNpby1jbXMnLFxyXG4gICAgICBmb3JtYXRzOiBbJ2VzJ10sXHJcbiAgICAgIGZpbGVOYW1lOiAoZm9ybWF0KSA9PiBgW25hbWVdLiR7Zm9ybWF0fS5qc2AsXHJcbiAgICB9LFxyXG4gICAgcm9sbHVwT3B0aW9uczoge1xyXG4gICAgICBleHRlcm5hbDogWydyZWFjdCcsICdyZWFjdC1kb20nXSxcclxuICAgICAgb3V0cHV0OiB7XHJcbiAgICAgICAgZ2xvYmFsczoge1xyXG4gICAgICAgICAgcmVhY3Q6ICdSZWFjdCcsXHJcbiAgICAgICAgICAncmVhY3QtZG9tJzogJ1JlYWN0RE9NJyxcclxuICAgICAgICB9LFxyXG4gICAgICAgIGlubGluZUR5bmFtaWNJbXBvcnRzOiBmYWxzZSxcclxuICAgICAgICBwcmVzZXJ2ZU1vZHVsZXM6IHRydWUsXHJcbiAgICAgICAgcHJlc2VydmVNb2R1bGVzUm9vdDogJ3NyYycsXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgcmVzb2x2ZToge1xyXG4gICAgYWxpYXM6IHtcclxuICAgICAgJ0AnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMnKSxcclxuICAgIH0sXHJcbiAgfSxcclxufSk7XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBZ1csU0FBUyxvQkFBb0I7QUFDN1gsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sVUFBVTtBQUNqQixPQUFPLFNBQVM7QUFIaEIsSUFBTSxtQ0FBbUM7QUFNekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sSUFBSTtBQUFBLE1BQ0Ysa0JBQWtCO0FBQUEsSUFDcEIsQ0FBQztBQUFBLEVBQ0g7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLEtBQUs7QUFBQSxNQUNILE9BQU87QUFBQSxRQUNMLE1BQU0sS0FBSyxRQUFRLGtDQUFXLHlCQUF5QjtBQUFBLFFBQ3ZELGtCQUFrQixLQUFLLFFBQVEsa0NBQVcsOEJBQThCO0FBQUEsTUFDMUU7QUFBQSxNQUNBLE1BQU07QUFBQSxNQUNOLFNBQVMsQ0FBQyxJQUFJO0FBQUEsTUFDZCxVQUFVLENBQUMsV0FBVyxVQUFVLE1BQU07QUFBQSxJQUN4QztBQUFBLElBQ0EsZUFBZTtBQUFBLE1BQ2IsVUFBVSxDQUFDLFNBQVMsV0FBVztBQUFBLE1BQy9CLFFBQVE7QUFBQSxRQUNOLFNBQVM7QUFBQSxVQUNQLE9BQU87QUFBQSxVQUNQLGFBQWE7QUFBQSxRQUNmO0FBQUEsUUFDQSxzQkFBc0I7QUFBQSxRQUN0QixpQkFBaUI7QUFBQSxRQUNqQixxQkFBcUI7QUFBQSxNQUN2QjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsSUFDdEM7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
