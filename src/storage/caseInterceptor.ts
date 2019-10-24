import { InterceptorType, QueryResultRowType } from 'slonik';

export function createCaseInterceptor(): InterceptorType {
  return {
    transformRow: (ctx, query, row, fields) => {
      const transformedRow: QueryResultRowType<string> = {};

      fields
        .map(field => {
          return {
            formatted: field.name.includes('_')
              ? toCamelCase(field.name)
              : field.name,
            original: field.name,
          };
        })
        .forEach(field => {
          transformedRow[field.formatted] = row[field.original];
        });

      return transformedRow;
    },
  };
}

function toCamelCase(text: string) {
  return text.replace(/([_][a-z])/gi, c => c.toUpperCase().replace('_', ''));
}

export function toSnakeCase(text: string) {
  return text.replace(/([A-Z])/g, c => '_' + c.toLowerCase());
}
