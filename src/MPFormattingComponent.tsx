function trimMPFormatingLinks(formated) {
    return formated.replace(/\$lhp(\[[^\]]*\]?)?/gi, '');
}
function trimMPFormating(formated) {
    return formated.replace(/\$(lhp(\[[^\]]*\]?)?|[ioswnzmg<>]|[0123456789abcdef]{1,3})/gi, '');
}
function MPHtml(name) {
    if (/^\s*$/.test(trimMPFormating(name)))
        return { __html:  '<i><del>unnamed</del></i>'};
    
    return { __html:  window.MPStyle.Parser.toHTML(trimMPFormatingLinks(name))};
}

const MPFormattingComponent = ({ name }: { name: string }) => {
    return <span className="mp-element" dangerouslySetInnerHTML={MPHtml(name)}></span>;
}

export default MPFormattingComponent;
