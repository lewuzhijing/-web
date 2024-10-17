<template>
  <div>
    <div style="margin-bottom: 5px;">
      <el-input v-model= "name" placeholder="请输入名字" suffix-icon="el-icon-search" style="width:200px"
                @keyup.enter.native="loadPost"></el-input>
      <el-select v-model="sex" placeholder="请选择性别" style="margin-left: 5px;">
        <el-option
            v-for="item in sexs"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
      </el-select>
      <el-button type="primary" style="margin-left: 5px;" @click="loadPost">查询</el-button>
      <el-button type="success" @click="resetParam">重置</el-button>
<!--      <el-button type="primary" style="margin-left: 5px;" @click="add">新增</el-button>-->
    </div>
    <el-table :data="tableData"
              :header-cell-style="{background:'gray'}"
              border
              highlight-current-row
              @current-change="selectCurrentChange"
    >
      <el-table-column prop="id" label="ID" width="60">
      </el-table-column>
      <el-table-column prop="no" label="账号" width="180">
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="120">
      </el-table-column>
      <el-table-column prop="age" label="年龄" width="120">
      </el-table-column>
      <el-table-column prop="sex" label="性别" width="">

        <template slot-scope="scope">
          <el-tag
              :type="scope.row.sex === 1 ? 'primary' : 'success'"
              disable-transitions>{{scope.row.sex === 1 ? '男' : '女'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="roleId" label="角色" width="180">
        <template slot-scope="scope">
          <el-tag
              :type="scope.row.roleId === 0 ? 'danger' : (scope.row.roleId ===1 ? 'primary' : 'success')"
              disable-transitions>{{scope.row.roleId === 0 ? '超级管理员' : (scope.row.roleId ===1 ? '管理员' : '用户')}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="电话" width="180">
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



  </div>

</template>

<script>
export default {
  name: "SelectUser",
  data() {


    let checkDuplicate =(rule,value,callback)=>{
      if(this.form.id){
        return callback();
      }
      this.$axios.get(this.$httpUrl+"/user/findByNo?no="+this.form.no).then(res=>res.data).then(res=>{
        if(res.code!=200){

          callback()
        }else{
          callback(new Error('账号已经存在'));
        }
      })
    };
    return {
      tableData: [],
      pageSize:5,
      pageNum:1,
      total:0,
      name: '',
      sex:'',
      sexs:[
        {
          value:'',
          label:'不限'
        },
        {
          value:'1',
          label:'男'
        },{
          value:'0',
          label:'女'
        }
      ],
      centerDialogVisible:false,
      form:{
        id:'',
        no:'',
        name:'',
        password:'',
        age:'',
        phone:'',
        sex:'',
        roleId:'2'
      },
      rules: {

      }
    }
  },
  methods:{
    selectCurrentChange(val) {
    //  this.currentRow = val;
      this.$emit("doSelectUser",val)
    },
    resetForm() {
      this.$refs.form.resetFields();
    },
    del(id){
      console.log(1)
      this.$axios.get(this.$httpUrl+'/user/del?id='+id).then(res=>res.data).then(res=>{
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
    add(){

      this.centerDialogVisible=true
      this.$nextTick(()=>{

        this.resetForm();
      })
    },
    mod(row){
      console.log(row)
      this.centerDialogVisible =true
      this.$nextTick(()=>{
        this.form.id= row.id;
        this.form.no= row.no;
        this.form.name= row.name;
        this.form.password= '';
        this.form.age= row.age;
        this.form.sex= row.sex+'';
        this.form.phone= row.phone;
        this.form.roleId=row.roleId;

      })

    },

    doSave(){
      this.$axios.post(this.$httpUrl+'/user/save',this.form).then(res=>res.data).then(res=>{
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
      this.$axios.post(this.$httpUrl+'/user/update',this.form).then(res=>res.data).then(res=>{
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
    loadGet(){
      this.$axios.get(this.$httpUrl+'/user/list').then(res=>res.data).then(res=>{
        console.log(res)
        this.tableData=res
      })
    },
    //
    // loadPost(){
    //   this.$axios.post(this.$httpUrl+'/user/listP',{}).then(res=>res.data).then(res=>{
    //     console.log(res)
    //     if(res.code===200){
    //         this.tableData=res.data
    //     }
    //   })
    // },

    loadPost(){
      this.$axios.post(this.$httpUrl+'/user/listPageC1',{
        pageSize:this.pageSize,
        pageNum:this.pageNum,
        param:{
          name:this.name,
          sex:this.sex,
          roleId: '2'
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
    resetParam(){
      this.name=''
      this.sex=''
    }


  },

  beforeMount(){
    // this.loadGet();
    this.loadPost();
  }
}
</script>

<style scoped>

</style>