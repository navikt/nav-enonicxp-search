const configAndAppName = 'config.no-nav-navno';

const pageConfigFields = [
    'page-with-side-menus.title^3',
].map((item) => `page.${configAndAppName}.${item}`);

const layoutConfigFields = [
    'section-with-header.title^2',
].map((item) => `layout.${configAndAppName}.${item}`);

const partConfigFields = [
    'html-area.html',
    'page-header.title^3',
    'dynamic-header.title^2',
].map((item) => `part.${configAndAppName}.${item}`);

const componentFieldsToSearch = [
    ...pageConfigFields,
    ...layoutConfigFields,
    ...partConfigFields
].map(item => `components.${item}`);

export default componentFieldsToSearch;
