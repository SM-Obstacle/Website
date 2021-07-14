function MPHtml(name) {
    return { __html:  window.MPStyle.Parser.toHTML(name)};
}

const MPFormattingComponent = ({ name }: { name: string }) => {
    return <span className="mp-element" dangerouslySetInnerHTML={MPHtml(name)}></span>;
}

export default MPFormattingComponent;