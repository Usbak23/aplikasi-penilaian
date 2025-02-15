const Peserta = require ('../peserta/model');
const nilaiPostTest = require ('../postTest/model');
const Category = require ('../category/model')

module.exports ={
    index : async (req, res) => {
        try {
            const alertMessage = req.flash ('alertMessage');
            const alertStatus = req.flash ('alertStatus');
            const alert ={
                message: alertMessage, 
                status: alertStatus
            }

            const peserta = await Peserta.find();
            const category = await Category.find();
            const nilai = await nilaiPostTest.find();

            //
            
        } catch (err) {
            
        }
    }
}
