# Agent guide: donleqt/skills

## What this is

This repository is a curated collection of reusable agent skills for indie builders.  
Each skill is stored as a top-level folder containing a `SKILL.md` file.

## Setup & commands

| Task | Command |
|------|---------|
| Clone | `git clone https://github.com/donleqt/skills.git` |
| Check status | `git status --short` |
| Inspect recent commits | `git log --oneline -n 10` |
| Add a new skill folder | `mkdir -p <skill-slug>` |

## Project layout

- `README.md` - Public catalog of installable skills.
- `<skill-slug>/SKILL.md` - One top-level folder per skill (for example: `indie-marketing/SKILL.md`).
- `LICENSE` - Repository license.

## Conventions

- Keep exactly one skill per top-level folder.
- Use kebab-case for skill folder names (for example: `idea-validation`).
- Every skill must include YAML frontmatter with at least `name` and `description`.
- Preserve user-provided skill content as much as possible; only normalize formatting when needed.
- When adding a new public skill, always update `README.md` with an install command.
- Skip `README.md` updates only for internal/private guide skills when the user explicitly requests no listing.
- Use Conventional Commits with emoji when committing (for example: `feat(scope): ✨ message`).

## Boundaries

- No secrets or environment variables are documented in this repository.
- This repo is content-focused; avoid introducing unnecessary app/framework scaffolding.

## References

- `README.md`
- Existing skills as examples:
  - `indie-app-naming/SKILL.md`
  - `indie-marketing/SKILL.md`
  - `idea-validation/SKILL.md`
  - `building-in-public/SKILL.md`
