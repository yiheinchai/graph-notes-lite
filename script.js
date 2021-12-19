
const elementHierarchy = {
    "h1": 0,
    "h2": 1,
    "h3": 2,
    "p": {
        "":3,
        "72pt": 4,
        "108pt": 5,
        "144pt": 6
    }
}

const elements = document.querySelectorAll(".WordSection1 > *")
const elementArray = [...elements]


const output = elementArray.reduce((previous, current, index, array) => {
    if(current.localName === "p") {
        try {
        current.removeChild(current.querySelector("span"))
        } catch {

        }
    }
if (index > 0 && array[index-1].localName){
    if (current.localName != 'p' && current.localName != 'h1' && current.localName != 'h2' && current.localName != 'h3') {
        return previous
    }
    let currentHierarchy
    if (current.localName === 'p') {
        currentHierarchy = elementHierarchy[current.localName][current.style.marginLeft]
    } else {
        currentHierarchy = elementHierarchy[current.localName]
    }
    if (!previous) {
        return [currentHierarchy, {
            text: current.textContent,
            children: []
        }]
    } else if (previous[0] === currentHierarchy) {
     insertSibilingInLatestAndDeepestDepths(previous[1], {
        text: current.textContent.replace("\n"," ").replace("�", "-"),
        children: []
    })
    }
     else if (previous[0] > currentHierarchy) {
     insertSibilingAtSpecifiedDepth(previous[1], {
        text: current.textContent.replace("\n"," ").replace("�", "-"),
        children: []
    }, currentHierarchy )
    }
     else if (previous[0] < currentHierarchy) {
     insertChildInLatestAndDeepestDepths(previous[1], {
        text: current.textContent.replace("\n"," ").replace("�", "-"),
        children: []
    })
    }
    return [currentHierarchy, previous[1]]
}
return previous
}, [0,{text: "Immunology", children: []}])

console.log(output)

function insertSibilingInLatestAndDeepestDepths(object, data) {
    if (object.children[object.children.length-1].children.length === 0) {
        return insertChildren(object, data)
    } else {
        return insertSibilingInLatestAndDeepestDepths(object.children[object.children.length-1], data)
    }
}

function insertChildInLatestAndDeepestDepths(object,data) {
    if (object.children.length === 0) {
        return insertChildren(object, data)
    } else {
        return insertChildInLatestAndDeepestDepths(object.children[object.children.length-1], data)
    }
}
function insertChildAtSpecifiedDepth(object,data, depth) {
    if (depth === 0) {
        return insertChildren(object, data)
    } else {
        return insertChildAtSpecifiedDepth(object.children[object.children.length-1], data, depth -1)
    }
}
function insertSibilingAtSpecifiedDepth(object,data, depth) {
    if (depth === 1) {
        return insertChildren(object, data)
    } else {
        return insertSibilingAtSpecifiedDepth(object.children[object.children.length-1], data, depth -1)
    }
}

// Access the last correct node and append another chlid
function insertChildren(object, data) {
    object.children.push(data)
    return object
}