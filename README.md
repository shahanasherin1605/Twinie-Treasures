cd "c:\Users\shahana sherin\photo-frame-store"
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main# Photo Frame Store

A React + Vite photo frame storefront.

## Build

The project has been built successfully to `dist/`.

```bash
npm run build
```

## Deployment Options

### GitHub Pages

1. Initialize git locally and create a GitHub repository.
2. Push the project to GitHub.
3. In the repository settings, enable GitHub Pages and select the `gh-pages` branch or `main` branch with `/docs` folder.
4. If using Vite, configure `base` in `vite.config.js` for the GitHub Pages path if needed.

### Netlify

1. Create a Netlify account.
2. Drag the `dist/` folder into Netlify Drop, or connect the GitHub repo.
3. Set the build command to `npm run build` and publish directory to `dist`.

### Vercel

1. Create a Vercel account.
2. Import the GitHub repo.
3. Use the default settings with `npm run build` and `dist` as the output directory.

## Notes

- The app is ready for deployment from the `dist/` folder.
- The current environment does not have `git` installed, so remote repository creation and push cannot be completed here.
- Once `git` is available, I can help you initialize the repo and set up GitHub deployment.
