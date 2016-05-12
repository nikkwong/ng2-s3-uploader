// Implement for XHR and managedFile arr member.

export type IXhrRequestState = 'PENDING' | 'READY' | 'COMPLETE' | 'ABORTED' | 'ERROR';

export class Policy {
    s3Signature: string;
    signatureKey: string;
    base64Policy: string;
    accessKeyId: string;
    xAmzCredential: string;
    xAmzMetaUuid: string;
    xAmzDate: string;
    xAmzAcl: string;
    xAmzBucket: string;
    xAmzAlgorithm: string;
    xAmzServerSideEncryption: string;
    folder: string;
    constructor(private policy) {
        this.s3Signature = policy.s3Signature;
        this.accessKeyId = policy.accessKeyId;
        this.signatureKey = policy.signatureKey;
        this.base64Policy = policy.base64Policy;
        this.folder = policy.folder;
        this.xAmzAcl = policy.xAmzAcl;
        this.xAmzDate = policy.xAmzDate;
        this.xAmzBucket = policy.xAmzBucket;
        this.xAmzMetaUuid = policy.xAmzMetaUuid;
        this.xAmzAlgorithm = policy.xAmzAlgorithm;
        this.xAmzCredential = policy.xAmzCredential;
        this.xAmzServerSideEncryption = policy.xAmzServerSideEncryption;
    }
}

export class ManagedUpload {

    status: IXhrRequestState;
    file: File;
    formData: FormData;
    xhr: XMLHttpRequest;
    path: string;
    progress: number;
    total: number;
    constructor(file, folder, path, policy: Policy) {

        this.file = file;
        this.formData = this._createFormData(file, folder, path, policy);
        this.status = 'READY';
        this.path = path;
        this.progress = 0;
        this.total = 0;

    }

    private _createFormData(file, folder, path, policy) {

        let formData = new FormData;
        if (!policy)
            throw new Error('No valid policy in Managed upload creator');

        formData.append('acl', policy.xAmzAcl);
        formData.append('Content-Type', file.type);
        formData.append('X-Amz-Date', policy.xAmzDate);
        formData.append('x-amz-server-side-encryption', policy.xAmzServerSideEncryption);
        formData.append('x-amz-meta-uuid', policy.xAmzMetaUuid);
        formData.append('X-Amz-Algorithm', policy.xAmzAlgorithm);
        formData.append('X-Amz-Credential', policy.xAmzCredential);
        formData.append('X-Amz-Signature', policy.s3Signature);
        formData.append('Policy', policy.base64Policy);
        formData.append('key', folder + '/' + file.name);
        // File field must come last! 
        formData.append('file', file);
        return formData;

    }

}