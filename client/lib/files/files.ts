//Maps used as they are Optimized for frequent updates - Zicor
type FileNode = {
    type: 'file' | 'dir';
    content?: string;
    children?: Map<string, FileNode>
}
export class FileStore {
    private files: Map<string, FileNode>

    constructor() {
        this.files = new Map();
        this.files.set('/', { type: 'dir', children: new Map()});
    }

    private resolvePath(path: string): FileNode | null { 
        const parts = path.split('/').filter(part => part.length > 0);
        let current = this.files.get('/')
        
        for (const part of parts) {
            if(!current?.children?.get(part)) {
                return null
            }
            current = current.children.get(part)
        }
        return current ?? null
    }

    public createFile(path: string, content: string): FileNode | null {
        const parts = path.split('/').filter(part => part.length > 0);
        const parentNode = this.resolvePath(parts.slice(0, -1).join('/'))
        if(!parentNode) {
            return null
        }
        const fileName = parts[parts.length - 1]
        parentNode?.children?.set(fileName, {type: 'file', content})
        return parentNode.children?.get(fileName) ?? null
    }

    public createDir(path: string): FileNode | null {
        const parts = path.split('/').filter(part => part.length > 0);
        let current = this.files.get('/')
        for (const part of parts) {
            if (!current?.children?.get(part)) {
                current?.children?.set(part, {type: 'dir', children: new Map()})
                current = current?.children?.get(part)
            }
            current = current?.children?.get(part)
        }
        return current ?? null
    }

    public getFile(path: string): FileNode | null {
        const node = this.resolvePath(path);
        return node?.type === 'file' ? node : null;
    }

}

