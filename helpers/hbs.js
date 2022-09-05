const moment = require("moment")

/**
 *  @desc Los Helpers bienen a ser como funciones que se pueden pasar como props, se registran en handlebars antes
 */
module.exports = {
    formatDate: (date, format) => {
        return moment(date).format(format)
    },
    truncate: (str, length) => {
        if (str.length > length && str.length > 0) {
            let newStr = str + ' '
            newStr = str.substr(0, length)
            newStr = str.substr(0, newStr.lastIndexOf(' '))
            newStr = newStr.length > 0 ? newStr : str.substr(0, length)
            return newStr + '...'
        }
        return str
    },
    stripTags: (input) => {
        return input.replace(/<(?:.|\n)*?>/gm, '')
    },
    editIcon: (storyUser, loggedUser, storyId, floating = true) => {
        if (storyUser._id.toString() == loggedUser._id.toString()) {
            if (floating) {
                return `<a href="/stories/edit/${storyId}" class="btn-floating halfway-fab blue">
                            <i class="fas fa-edit fa-small"></i>
                        </a>`
            } else {
                return `<a href="/stories/edit/${storyId}">
                            <i class="fas fa-edit"></i>
                        </a>`
            }
        } else {
            return ""
        }
    },
    select: (selected, options) => {
        return options.fn(this)
            .replace(
                new RegExp(`value="${selected}"`),
                '$& selected="selected"'
            )
            .replace(
                new RegExp(`>${selected}</option>`),
                ' selected="selected"$&'
            )
    }
}