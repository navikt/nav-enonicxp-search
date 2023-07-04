export const excludedPathsQuerySegment = [
    '/content/www.nav.no/no/nav-og-samfunn/samarbeid/for-kommunen/sosiale-tjenester-i-nav-kontoret2*',
    '/content/www.nav.no/no/nav-og-samfunn/samarbeid/for-kommunen/kvalifiseringsprogrammet2*',
    '/content/www.nav.no/no/nav-og-samfunn/samarbeid/for-kommunen/boligsosialt-arbeid2*',
    '/content/www.nav.no/no/nav-og-samfunn/samarbeid/for-kommunen/okonomisk-radgivning-og-gjeldsradgivning2*',
    '/content/www.nav.no/no/nav-og-samfunn/samarbeid/for-kommunen/okonomisk-stonad-sosialhjelp*',
    '/content/www.nav.no/no/nav-og-samfunn/samarbeid/for-kommunen/barn-og-unge2*',
    '/content/www.nav.no/no/nav-og-samfunn/samarbeid/for-kommunen/satsingsomrader2*',
]
    .map((path) => `contentPath NOT LIKE "${path}"`)
    .join(' AND ');
