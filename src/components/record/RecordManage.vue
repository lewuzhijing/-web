<template>
  <div>
    <div style="margin-bottom: 5px;">
      <el-input v-model= "name" placeholder="请输入物品名" suffix-icon="el-icon-search" style="width:200px"
                @keyup.enter.native="loadPost"></el-input>

      <el-select v-model="storage" placeholder="请选择仓库" style="margin-left: 5px">
        <el-option
            v-for="item in storageData"
            :key="item.id"
            :label="item.name"
            :value="item.id">
        </el-option>
      </el-select>

      <el-select v-model="goodstype" placeholder="请选择分类" style="margin-left: 5px">
        <el-option
            v-for="item in goodstypeData"
            :key="item.id"
            :label="item.name"
            :value="item.id">
        </el-option>
      </el-select>

      <el-button type="primary" style="margin-left: 5px;" @click="loadPost">查询</el-button>
      <el-button type="success" @click="resetParam">重置</el-button>
    </div>
    <el-table :data="tableData"
              :header-cell-style="{background:'gray'}"
              border
    >
      <el-table-column prop="id" label="ID" width="60">
      </el-table-column>
      <el-table-column prop="goodsname" label="物品名" width="180">
      </el-table-column>

      <el-table-column prop="storagename" label="仓库" width="180" >
      </el-table-column>

      <el-table-column prop="goodstypename" label="分类" width="180" >
      </el-table-column>

      <el-table-column prop="adminname" label="操作人" width="180" >
      </el-table-column>


      <el-table-column prop="username" label="申请人" width="180" >
      </el-table-column>


      <el-table-column prop="count" label="数量" width="180">
      </el-table-column>

      <el-table-column prop="createtime" label="操作时间" width="180" >
      </el-table-column>

      <el-table-column prop="remark" label="备注" >
      </el-table-column>


    </el-table>
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[2,5, 10, 400]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
    </el-pagination>

    <el-dialog
        title="提示"
        :visible.sync="centerDialogVisible"
        width="30%"
        center>

      <el-form ref="form" :rules="rules" :model="form" label-width="80px">


        <el-form-item label="物品名" prop="name">
          <el-col :span="20">
            <el-input v-model="form.name"></el-input>
          </el-col>
        </el-form-item>
          <el-form-item label="仓库" prop="storage">
            <el-col :span="20">
              <el-select v-model="form.storage" placeholder="请选择仓库" >
              <el-option
                  v-for="item in storageData"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
              </el-option>
            </el-select>
            </el-col>
          </el-form-item>
            <el-form-item label="分类" prop="goodstype">
              <el-col :span="20">
                <el-select v-model="form.goodstype" placeholder="请选择分类" style="margin-left: 5px">
                  <el-option
                      v-for="item in goodstypeData"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                  </el-option>
                </el-select>
              </el-col>
            </el-form-item>


              <el-form-item label="数量" prop="count">
                <el-col :span="20">
                  <el-input v-model="form.count"></el-input>
                </el-col>
              </el-form-item>

          <el-form-item  label="备注" prop="remark">
          <el-col :span="20">
            <el-input type="textarea" v-model="form.remark"></el-input>
          </el-col>
          </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="centerDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="save">确 定</el-button>
  </span>
    </el-dialog>

  </div>

</template>

<script>
export default {
  name: "RecordManage",
  data() {



    let checkCount = (rule, value, callback) => {
      if(value>9999){
        callback(new Error('数量输⼊过⼤'));
      }else{
        callback();
      }
    };
    return {
      user: JSON.parse(sessionStorage.getItem('CurUser')),
      storageData:[],
      goodstypeData:[],
      goodsData:[],
      tableData: [],
      pageSize:10,
      pageNum:1,
      total:0,
      name:'',
      storage:'',
      goodstype: '',
      centerDialogVisible:false,
      form:{
        id:'',
        name:'',
        storage:'',
        goodstype:'',
        count:'',
        remark:''

      },
      rules: {

        name: [
          {required: true, message: '请输入物品名', trigger: 'blur'},
        ],
        count: [
          {required: true, message: '请输⼊数量', trigger: 'blur'},
          {pattern: /^([1-9][0-9]*){1,4}$/,message: '数量必须为正整数字',trigger: "blur"},
          {validator:checkCount,trigger: 'blur'}
        ],
        storage: [
          {required: true, message: '请选择仓库名', trigger: 'blur'},
        ],
        goodstype: [
          {required: true, message: '请选择分类名', trigger: 'blur'},
        ],
      }
    }
  },
  methods:{

    formatStorage(row){
       let temp = this.storageData.find(item=>{
         return item.id ==row.storage
       })
      return temp && temp.name
    },
    formatGoodstype(row){
      let temp = this.goodstypeData.find(item=>{
        return item.id ==row.goodstype
      })
      return temp && temp.name
    },
    resetForm() {
      this.$refs.form.resetFields();
    },
    del(id){
      console.log(1)
      this.$axios.get(this.$httpUrl+'/goods/del?id='+id).then(res=>res.data).then(res=>{
        console.log(res)
        if(res.code==200){

          this.$message({
            message: '删除成功',
            type:'success'
          });
          this.centerDialogVisible =false
          this.loadPost()
        }else{
          this.$message({
            message: '删除失败',
            type:'error'
          });
        }
      })

    },
    add(){

      this.centerDialogVisible=true
      this.$nextTick(()=>{

        this.resetForm();
        this.form.id=''
      })
    },
    mod(row){
      console.log(row)
      this.centerDialogVisible =true
      this.$nextTick(()=>{
        this.form.id= row.id;
        this.form.name= row.name;
        this.form.storage= row.storage;
        this.form.goodstype= row.goodstype;
        this.form.count= row.count;
        this.form.remark= row.remark;

      })

    },

    doSave(){
      this.$axios.post(this.$httpUrl+'/goods/save',this.form).then(res=>res.data).then(res=>{
        console.log(res)
        if(res.code==200){

          this.$message({
            message: '增加成功',
            type:'success'
          });
          this.centerDialogVisible =false
          this.loadPost()
        }else{
          this.$message({
            message: '增加失败',
            type:'error'
          });
        }
      })
    },
    doMod(){
      this.$axios.post(this.$httpUrl+'/goods/update',this.form).then(res=>res.data).then(res=>{
        console.log(res)
        if(res.code==200){

          this.$message({
            message: '修改成功',
            type:'success'
          });
          this.centerDialogVisible =false
          this.loadPost()
        }else{
          this.$message({
            message: '修改失败',
            type:'error'
          });
        }
      })
    },
    save(){

      this.$refs.form.validate((valid) => {
        if (valid) {
          if(this.form.id){
            console.log(this.form.id)
            this.doMod();
          }
          else {
            this.doSave();
          }

        } else {
          console.log('error submit!!');
          return false;
        }
      });



    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize=val
      this.loadPost()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pageNum=val
      this.loadPost()
    },
    resetParam(){
      this.name=''
      this.storage=''
      this.goodstype=''
    },

    loadPost(){
      this.$axios.post(this.$httpUrl+'/record/listPage',{
        pageSize:this.pageSize,
        pageNum:this.pageNum,
        param:{
          name:this.name,
          storage:this.storage+'',
          goodstype: this.goodstype+'',
          userid: this.user.id+'',
          roleId: this.user.roleId+'',

        }
      }).then(res=>res.data).then(res=>{
        console.log(res)
        if(res.code==200){
          this.tableData=res.data
          this.total=res.total
        }else{
          alert('获取数据失败')
        }
      })
    },
    // loadPost(){
    //   this.$axios.get(this.$httpUrl+'/record/list'
    //   ).then(res=>res.data).then(res=>{
    //     console.log(res)
    //     if(res.code==200){
    //       this.tableData=res.data
    //       this.total=res.total
    //     }else{
    //       alert('获取数据失败')
    //     }
    //   })
    // },
    loadStorage(){
      this.$axios.get(this.$httpUrl+'/storage/list').then(res=>res.data).then(res=>{
        console.log(res)
        if(res.code==200){
          this.storageData=res.data
        }else{
          alert('获取数据失败')
        }
      })
    },
    loadGoodsType(){
      this.$axios.get(this.$httpUrl+'/goodstype/list').then(res=>res.data).then(res=>{
        console.log(res)
        if(res.code==200){
          this.goodstypeData=res.data
        }else{
          alert('获取数据失败')
        }
      })
    }



  },

  beforeMount(){
    // this.loadGet();
   this.loadStorage();
   this.loadGoodsType();
    this.loadPost();

  }
}
</script>

<style scoped>

</style>