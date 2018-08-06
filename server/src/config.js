const path = require('path');

module.exports = {
	auth: {
		// eslint-disable-next-line max-len
		secret: '1bfd41d785a278eb8973f5ef6380ce736b51fac07e3928ded1b478614ef610a142f31859217ecf38eaf7ca3deef3d6b9f0be0f8a7dcd7be11c8555537a2fabee0188abdddf9f16f9923165665e740afb463a8f4e44684e67efe5decef1be7a749561586fd2266141d107fcf2b3edb69d13368d2b3addc3efa8ea049a3652175110159efbf3b4e3fcb40d506e7b5064aaecf42cc0ecb37bee89ee054496f3c644b90c6958f128d536d64aee0199946659ef3b044376b7c6e70f6380b38cf056f6351b41a1ac260e7ff35f2872bf6aba727842b101849f550b4fbca5b8d39d16ab26f1d12687d4d8826f99a9a8eab72caa45e6ced9c97ac81188cc216d3ca400ad'
	},
	port: process.env.PORT || 3001,
	storagePath: process.env.STORAGE_PATH || path.join(__dirname, '../storage.db'),
};
