const modules = import.meta.glob('./*.jsx', { eager: true });

export const iconsList = Object.fromEntries(
  Object.entries(modules).map(([path, module]) => {
    const name = path
      .replace('./', '')
      .replace('.jsx', '');


    return [name, module.default];
  })
);