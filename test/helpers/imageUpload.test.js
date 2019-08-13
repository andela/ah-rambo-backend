import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { uploader } from 'cloudinary';
import Datauri from 'datauri';
import { imageUpload } from '../../server/helpers';

chai.use(sinonChai);

describe('image upload', () => {
  context('when the user update their avatarUrl', () => {
    it('returns image url', async () => {
      const req = {
        file: { originalname: 'image' },
        buffer: {}
      };
      const uploadStub = sinon
        .stub(uploader, 'upload')
        .returns({ url: 'imageurl' });
      sinon.stub(Datauri.prototype, 'format').returns({ content: 'file' });
      const imageUrl = await imageUpload(req);
      expect(uploadStub).calledWith('file');
      expect(imageUrl).eql('imageurl');
      uploader.upload.restore();
      Datauri.prototype.format.restore();
    });
  });
});
