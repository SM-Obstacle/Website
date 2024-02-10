import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'schema.graphql',
  documents: ['src/**/*.ts*'],
  generates: {
    './src/app/__generated__/': {
      preset: 'client',
      plugins: [],
      presetConfig: {
        fragmentMasking: false,
        gqlTagName: 'gql',
      }
    }
  },
  noSilentErrors: true,
  ignoreNoDocuments: true,
};

export default config;