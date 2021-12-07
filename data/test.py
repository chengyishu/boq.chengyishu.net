import os
for x in range(1,292):
	os.system('echo \'{\' > ' + str(x).zfill(3) + '.json')
	os.system('echo \'	"qid": ' + str(x) + ',\' >> ' + str(x).zfill(3) + '.json')
	os.system('echo \'	"date": "0000-00-00",\' >> ' + str(x).zfill(3) + '.json')
	os.system('echo \'	"zh": {\' >> ' + str(x).zfill(3) + '.json')
	os.system('echo \'	    "content": "待续 ...",\' >> ' + str(x).zfill(3) + '.json')
	os.system('echo \'	    "note": [
			""
		]\' >> ' + str(x).zfill(3) + '.json')
	os.system('echo \'	},\' >> ' + str(x).zfill(3) + '.json')
	os.system('echo \'	"ja": {\' >> ' + str(x).zfill(3) + '.json')
	os.system('echo \'	    "content": "つづく ...",\' >> ' + str(x).zfill(3) + '.json')
	os.system('echo \'	    "note": [
			""
		]\' >> ' + str(x).zfill(3) + '.json')
	os.system('echo \'	},\' >> ' + str(x).zfill(3) + '.json')
	os.system('echo \'	"en": {\' >> ' + str(x).zfill(3) + '.json')
	os.system('echo \'	    "content": "to be continued ...",\' >> ' + str(x).zfill(3) + '.json')
	os.system('echo \'	    "note": [
			""
		]\' >> ' + str(x).zfill(3) + '.json')
	os.system('echo \'	}\' >> ' + str(x).zfill(3) + '.json')
	os.system('echo \'}\' >> ' + str(x).zfill(3) + '.json')