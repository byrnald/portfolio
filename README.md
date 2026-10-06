# My portfolio

Hey, I'm Byron. I'm studying ITI at Rutgers and working as an IT Support Specialist with Rutgers DCS. This is where I share what I'm building, what I'm learning, and a little about my homelab.

**Check it out:** [byrnald.github.io/portfolio](https://byrnald.github.io/portfolio/)

I kept the design mostly black, white, and grey, with a light mode if that's more your thing. There's an interactive Smart Pantry overview, a homelab section, my experience, and a resume you can open or download. The stars hang out outside the page borders, and the border beams take a slower lap around the page. The extra motion turns off if you prefer reduced motion.

## What I'm using

React, TypeScript, Vite, Tailwind CSS, Framer Motion, and Radix UI. I adapted the [Magic UI border beam](https://magicui.design/docs/components/border-beam) to fit the monochrome theme.

## Running it locally

You'll need Node.js 22.13 or newer.

```sh
npm ci
npm run dev
```

To check the types and make a production build:

```sh
npm run build
```

## Where things live

- `components/ui/` has the sections and reusable components.
- `lib/portfolio-data.ts` holds my skills, experience, links, and homelab details.
- `app/globals.css` has the theme tokens and styles.
- `public/resume.pdf` is my downloadable resume.

Some of the intro and About copy lives right in the section components. Content updates are manual, so the site doesn't need to pull from GitHub when someone visits.

## Publishing

When I push to `main`, GitHub Actions builds the site and publishes it to GitHub Pages. The workflow picks up the right base path, including the resume and favicon, so it also works if I add a custom domain later.

The deployment environment is `portfolio-production`, and only `main` can deploy to it.

## The original version

I kept my old portfolio in the [`backup/original-portfolio` branch](https://github.com/byrnald/portfolio/tree/backup/original-portfolio) and the [`portfolio-v1` tag](https://github.com/byrnald/portfolio/tree/portfolio-v1). Its original files and history are still there if I want to look back or roll things back.

The separate [v2 preview](https://github.com/byrnald/portfolio-v2) is still available too.