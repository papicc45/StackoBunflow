import Swal from 'sweetalert2';
import Quill from 'quill';

let Inline = Quill.import('blots/inline');

class InlineCode extends Inline { }
InlineCode.blotName = 'inlineCode';
InlineCode.tagName = 'CODE';

Quill.register({
    'formats/inlineCode' : InlineCode
})

const inlineCodeIcon = 'IC';
export  const modules = {
    toolbar: [
        //[{ 'font': [] }],
        [{ 'header': [1, 2, false] }],
        ['bold', 'italic', 'underline','strike', 'blockquote'],
        [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
        ['link', 'image'],
        [{ 'align': [] }, { 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        ['code-block'],
        [{ inlineCode : inlineCodeIcon }]
    ],
}

export const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image',
    'align', 'color', 'background', 'code-block',
    "inlineCode"
]
