import { UnsupportedMediaTypeException } from "@nestjs/common";
import { extname } from "path";

export const editFileName = (req, file, callback) => {
	const name = file.originalname.split('.')[0];
	const fileExtName = extname(file.originalname);
	callback(null, `${file.originalname}_${req.user.username}${fileExtName}`);
  };
  
  export const imageFileFilter = (req, file, callback) => {
	if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
	  return callback(new UnsupportedMediaTypeException('Only jpg|jpeg|png|gif files are allowed!'), false);
	}
	callback(null, true);
  };