function trimMPFormatingLinks(formated) {
    return formated.replace(/\$[lhp](\[([^\]]*\])?)?/gi, '');
}
function trimMPFormating(formated) {
    return formated.replace(/\$([lhp](\[([^\]]*\])?)?|[ioswnzmg<>]|[0123456789abcdef]{1,3})/gi, '');
}
function MPHtml(name) {
    return window.MPStyle.Parser.toHTML(name);
}

const MPFormattingComponent = ({ name, placeholder = '(unnamed)' }: { name: string; placeholder?: string }) => {
    let sanitized_name = trimMPFormatingLinks(name);
    
    if (/^\s*$/.test(trimMPFormating(name)))
        sanitized_name += placeholder;
    
    return <span className="mp-element" dangerouslySetInnerHTML={ { __html: MPHtml(sanitized_name) } }></span>;
}

export default MPFormattingComponent;
