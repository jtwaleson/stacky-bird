const localeTranslations = {};

const translationFiles = require.context(
    // The relative path of the components folder
    './translations',
    // Whether or not to look in subfolders
    false,
    // The regular expression used to match base component filenames
    /\w+\.(json)$/
)

translationFiles.keys().forEach(fileName => {
    localeTranslations[fileName.replace(/.json/, "").replace(/\.\//, "")] = translationFiles(fileName);
})

let locale = "en";

export default function translations(key) {
    return localeTranslations[locale][key];
}
