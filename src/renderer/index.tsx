import { RendererConfig } from 'coulomb/config/renderer';
import { renderApp } from 'coulomb/app/renderer';
import { callIPC } from 'coulomb/ipc/renderer';
import { conf as appConf, availableLanguages, defaultLanguage } from '../app';


export const conf: RendererConfig<typeof appConf> = {
  app: appConf,

  windowComponents: {
    default: () => import('./home'),
    batchCommit: () => import('./batch-commit'),
    settings: () => import('coulomb/settings/renderer'),
  },

  databaseStatusComponents: {
    default: () => import('coulomb/db/isogit-yaml/renderer/status'),
  },

  contextProviders: [{
    cls: () => import('coulomb/localizer/renderer/context-provider'),
    getProps: async () => {
      type RegisterMeta = { subregisters: { [id: string]: any } };

      let registerMeta: RegisterMeta | null;

      try {
        registerMeta = (await callIPC<{ objectID: 'register' }, { object: RegisterMeta | null }>
        ('db-default-read', { objectID: 'register' })).object;
      } catch (e) {
        registerMeta = null;
      }

      let langs: { [lang: string]: string };
      if (registerMeta) {
        const langSubregisters = Object.keys(registerMeta.subregisters).
        filter(k => availableLanguages[k as keyof typeof availableLanguages] !== undefined) as (keyof typeof availableLanguages)[];

        langs = langSubregisters.
        map(langID => ({ [langID]: availableLanguages[langID] })).
        reduce((prev, curr) => ({ ...prev, ...curr }));
      } else {
        langs = availableLanguages;
      }

      return {
        available: langs,
        selected: defaultLanguage,
        default: defaultLanguage,
        // NOTE: Default language is treated as authoritative language.
        // TODO: Support more than one authoritative language.
      };
    },
  }, {
    cls: () => import('coulomb/db/renderer/single-db-status-context-provider'),
    getProps: async () => ({ dbName: 'default' }),
  }],
};


export const app = renderApp(conf);
