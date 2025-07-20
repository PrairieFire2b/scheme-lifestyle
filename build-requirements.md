# Build Requirements

# Build for production

To build the project, you need the following requirements:

- NodeJS (with package manager)
- Guile Next / Guile Hoot

Once these dependencies are ready, you should execute `npm install` at first (We recommended to install `pnpm`). Then you can execute `npm run build` to build the project. The output files will be placed in the `dist` directory.

# Develop

If you need to develop and "watch" it, you need to execute:

```
npm i serve nodemon -g
```

Then, you can use `npm run dev` to watch the project, and open another shell with `npm run build` to host the `dist`.
