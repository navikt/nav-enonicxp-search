const componentConfigPrefix = 'config.no-nav-navno';

const pageConfigFields = ['page-with-side-menus.title^3'].map(
    (item) => `page.${componentConfigPrefix}.${item}`
);

const layoutConfigFields = ['section-with-header.title^2'].map(
    (item) => `layout.${componentConfigPrefix}.${item}`
);

const partConfigFields = ['html-area.html', 'page-header.title^3', 'dynamic-header.title^2'].map(
    (item) => `part.${componentConfigPrefix}.${item}`
);

const componentFieldsToSearch = [
    ...pageConfigFields,
    ...layoutConfigFields,
    ...partConfigFields,
].map((item) => `components.${item}`);

const dataFieldsToSearch = [
    'title^5',
    'text',
    'ingress',
    'description',
    'abstract',
    'keywords^15',
    'enhet.*',
].map((item) => `data.${item}`);

const fieldsToSearch = [
    'attachment.*',
    'displayName^2',
    ...componentFieldsToSearch,
    ...dataFieldsToSearch,
].join(' ');

module.exports = { fieldsToSearch };
