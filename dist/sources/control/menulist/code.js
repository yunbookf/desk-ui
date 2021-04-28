"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unmounted = exports.mounted = exports.computed = exports.data = exports.props = void 0;
exports.props = {
    'width': {
        'default': undefined
    },
    'height': {
        'default': undefined
    },
    'left': {
        'default': 0
    },
    'top': {
        'default': 0
    },
    'zIndex': {
        'default': 0
    },
    'flex': {
        'default': ''
    }
};
exports.data = {
    'hasSubItemsCount': 0,
    'hasTypeItemsCount': 0,
    'itemPopShowing': undefined,
    'menulist': undefined
};
exports.computed = {
    'widthPx': function () {
        if (this.width !== undefined) {
            return this.width + 'px';
        }
        if (this.flex !== '') {
            let parent = this.cgParent();
            return parent ? (parent.direction === 'v' ? undefined : '0') : undefined;
        }
    },
    'heightPx': function () {
        if (this.height !== undefined) {
            return this.height + 'px';
        }
        if (this.flex !== '') {
            let parent = this.cgParent();
            return parent ? (parent.direction === 'v' ? '0' : undefined) : undefined;
        }
    }
};
exports.mounted = function () {
    var _a;
    let menulist = this.cgFindParent('menulist');
    if (menulist) {
        this.menulist = menulist;
    }
    if (((_a = this.$parent) === null || _a === void 0 ? void 0 : _a.popOpen) !== undefined) {
        this.$parent.selfPop = this;
        if (!menulist) {
            return;
        }
        ++menulist.hasSubItemsCount;
    }
};
exports.unmounted = function () {
    var _a;
    if (((_a = this.$parent) === null || _a === void 0 ? void 0 : _a.selfPop) === this) {
        this.$parent.selfPop = undefined;
        if (!this.menulist) {
            return;
        }
        --this.menulist.hasSubItemsCount;
    }
};