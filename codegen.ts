import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'schema.graphql',
  documents: ['src/**/*.ts*'],
  generates: {
    './src/app/__generated__/': {
      preset: 'client',
      plugins: [],
      config: {
        // client-preset v7 defaults to string-literal unions; the app uses enums as runtime values.
        enumType: 'native',
        // Custom scalars now default to `unknown`; both are serialized as ISO date strings.
        scalars: {
          DateTime: 'string',
          NaiveDateTime: 'string',
        },
      },
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