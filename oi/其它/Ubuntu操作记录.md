# Ubuntu 操作小记
## 软件安装相关
将源换至aliyun

### 推荐软件：
```plain
wps,firefox,emacs,chrome/Chromium,cherry tree,sougou pinyin,shutter,latern,cmdmarkdown,lemon,flash播放器插件,texlive,texstudio,atom,java
```

### firefox相关
#### firefox中文环境安装
```plain
http://ftp.mozilla.org/pub/firefox/releases/
找到对应的版本下的xpi，找到zh_CN.xpi
```

#### firefox 出现XML解析错误
```
通常是语言包的问题
sudo apt install firefox-locale-zh-hans
```

### Ubuntu主体美化
#### 主题美化工具
```plain
sudo apt install unity-tweak-tool
```

#### 主题增强工具
```plain
sudo apt install compiz
```

#### 几个不错的主题和配件
##### Flatabulous主题
```plain
sudo add-apt-repository ppa:noobslab/themes
sudo apt update
sudo apt install flatabulous-theme
配套图标
sudo add-apt-repository ppa:noobslab/icons
sudo apt update
sudo apt install ultra-flat-icons
```

##### Adapta主题
```plain
sudo apt-add-repository ppa:tista/adapta -y
sudo apt update
sudo apt install adapta-gtk-theme
```

##### Paper主题
```plain
sudo add-apt-repository ppa:snwh/pulp
sudo apt update
sudo apt install paper-gtk-theme paper-icon-theme
```

##### Numix主题
```plain
sudo add-apt-repository ppa:numix/ppa
sudo apt update
sudo apt install numix-icon-theme numix-icon-theme-circle
```

##### arc-flatabulous主题
```plain
sudo add-apt-repository ppa:noobslab/themes
sudo apt update
sudo apt install arc-theme 
或
sudo sh -c "echo 'deb http://download.opensuse.org/repositories/home:/Horst3180/xUbuntu_16.04/ /' > /etc/apt/sources.list.d/home:Horst3180.list"
sudo apt update
sudo apt install arc-theme
```

### Ubuntu系统相关
#### 字体安装
```plain
sudo apt-get install fonts-wqy-microhei
```

#### Flash播放器
```plain
系统设置”图标（一个扳手加齿轮的标志），启动系统设置窗口，点击窗口中“系统”一节中的“软件和更新”。将弹出“软件和更新”窗口，在其中点选“其他软件”选项卡，勾选其中的“Canonical 合作伙伴”选项。
sudo apt install adobe-flashplugin
```

#### 字体管理器
```plain
sudo apt install font-manager
```

#### 安装Windows字体
```plain
sudo apt install ttf-mscorefonts-installer
刷新字体缓存：sudo fc-cache -fsv
```

#### 批量字体安装
```plain
创建文件夹包含需要的字体
sudo cp -r 该目录 /usr/share/fonts/
sudo mkfontscale
sudo mkfontdir
sudo fc-cache -fv
```

#### 字体预览
```plain
sudo apt install gnome-specimen
```

#### 多线程下载工具aira2+uget  
[参考](https://blog.csdn.net/u010445843/article/details/70184121)
```plain
sudo add-apt-repository ppa:plushuang-tw/uget-stable
sudo apt update
sudo apt install uget

sudo add-apt-repository ppa:t-tujikawa/ppa
sudo apt update
sudo apt install aria2
```

### 其它常用软件安装
#### 安装Chromium
```plain
sudo add-apt-repository ppa:a-v-shkop/chromium
sudo apt update
sudo apt install chromium-browser
```

#### 安装texlive
##### 主体安装
```plain
使用图形化安装：sudo apt install perl-tk
将texlive.iso复制到home下
使用mount命令挂载到mnt:sudo mount -o loop home/sycstudio/texlive.iso /mnt
移动到mnt下
运行（以图形化）：sudo ./install-tl -gui
按照步骤安装
选择安装方案。初级用户推荐直接选择 scheme-full 全部安装。如果磁盘空间有限也可以选择small或者median模式。高级用户可以选择scheme-custom进一步定制。这里我选择了scheme-custom，并且在“进一步定制”里去掉了自己不会用到的一些语言包和ConTeXt相关组件。
由于这里是安装到系统里，因此portable setup选择了否，安装路径为默认。
选项里面选择默认为A4纸张大小，其它一些选项基本都选了是。其中要注意的是创建符号链接会在 /usr/local/bin里面创建指向可执行程序的软链接，从而可以直接使用latex,pdflatex等命令，此外还可以使用man latex等命令查看帮助。
建议在最后的get package updates一项选否，等安装好了之后手动安装更新。
最后卸载镜像文件：sudo umount /mnt
```

##### 字体拷贝
```plain
将texlive中的字体配置拷贝到系统中：sudo cp /usr/local/texlive/2017/texmf-var/fonts/conf/texlive-fontconfig.conf /etc/fonts/conf.d/09-texlive.conf
刷新系统字体缓存：sudo fc-cache -fsv
```

##### Texlive更新
```plain
利用中科大的源进行更新：
sudo tlmgr option repository http://mirrors.ustc.edu.cn/CTAN/systems/texlive/tlnet
sudo tlmgr update --self --all
```

##### 其它
###### minted宏包
```plain
使用minted宏包代码高亮需要pygmenize支持
sudo apt install python-pygments
编译命令加上选项-shell-escape
```

#### Java
[参考](https://www.java.com/zh_CN/download/help/linux_install.xml)
```plain
在/usr/下用mkdir建立java文件夹
用cp命令将javatar包拷贝到java文件夹中
解压tar zxvf jre-8***.tar.gz
最后删除tar包
```

#### Atom
```plain
sudo add-apt-repository ppa:webupd8team/atom
sudo apt update
sudo apt install atom
```

#### genymotion虚拟机
```plain
sudo apt install virtualbox
chmod u+x 安装文件.bin
执行（终端）
打开目录.Genymobile/*/ova/ 将genymotion_vbox86p_4.3_170321_020053.ova（genymotion_vbox86p_7.0_170321_002642.ova） 拷贝到目录下，然后随便创建一台系统版本为4.3(7.0)的虚拟机(按电脑配置自选)
启动虚拟机(若启动失败，sudo apt-get build-dep virtualbox)
将Genymotion-ARM-Translation_v2.0.zip拖入到虚拟机窗口中
重启虚拟机
将.apk文件拖入虚拟机窗口中即可安装
快乐的玩Game
```

#### GDebi
```plain
安装GDebi以方便地安装.deb文件
sudo apt install gdbei
```

#### Lemon
##### Lemon安装
```plain
要实现lemon的编译安装，需要qt4
sudo apt install qt4-dev-tools
然后移动到lemon的目录下
qmake lemon.pro
make
```

##### lemon无法编译的问题
```plain
安装依赖包g++-multilib
```

#### Typora
```plain
# optional, but recommended
sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys BA300B7755AFCFAE
# add Typora's repository
sudo add-apt-repository 'deb https://typora.io/linux ./'
sudo apt update
# install typora
sudo apt install typora
```

#### albert快速搜索工具
```plain
sudo add-apt-repository ppa:nilarimogard/webupd8
sudo apt update
sudo apt install albert
```

#### dorky底部工具
```plain
sudo add-apt-repository ppa:docky-core/stable
//上面的是稳定版软件源，如果想用开发版，则添加的地址是ppa:docky-core/ppa
sudo apt update
sudo apt install docky
```

#### FileZilla ftp工具
```plain
sudo add-apt-repository ppa:n-muench/programs-ppa
sudo apt update
sudo apt install filezilla
```

#### gnome-pie 快速启动工具
```plain
sudo add-apt-repository ppa:simonschneegans/testing
sudo apt-get update
sudo apt-get install gnome-pie
```

#### ZSH
#### zsh安装和调整
安装 两种方式：
```plain
sh -c "$(curl -fsSL https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh)" 
sh -c "$(wget https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh -O -)" 
```

#### 主题
比较推荐：`agnoster-fcamblor`　需要搭配 `Powerline fonts`字体使用  
主题：github：https://github.com/fcamblor/oh-my-zsh-agnoster-fcamblor  
字体：https://github.com/powerline/fonts  
均运行install即可。  
主题均保存在中 `~/.oh-my-zsh/themes` ，修改的时候修改 `~/.zshrc` 文件，找到 `ZSH_THEME="××××"` ，修改为对应的名称。
字体修改为 `powerline` 的字体就不会出现乱码  
终端背景颜色：`#03183B`

## Ubuntu系统常见问题汇总

### 双系统无法挂载某盘
```plain
sudo fdisk -l 
sudo ntfsfix /dev/……修复对应挂载的盘
```

### 安装microsoft-ttf 出现 “无法被用户'_apt'访问，无法降低权限以进行下载。 - pkgAcquire::Run (13: 权限不够)”问题
```plain
sudo chown -R _apt:root /var/lib/update-notifier/package-data-downloads/partial/
sudo rm /var/lib/update-notifier/package-data-downloads/partial/*.FAILED
sudo apt install --reinstall update-notifier-common
sudo apt install --reinstall 软件名
https://bugs.launchpad.net/ubuntu/+source/update-notifier/+bug/1570141
```

### U盘变成只读
```plain
找到U盘挂载的分区，一般是/usr/sdb+数字
umount 对应的U盘
sudo dosfsck -v -a /dev/sdb+数字
重新挂载
```

### 无法获得锁
```plain
sudo rm /var/cache/apt/archives/lock
sudo rm /var/lib/dpkg/lock
sudo dpkg --configure -a
```

### 锁定某一个软件不更新
```plain
设置方法：sudo echo "软件包名 hold" | sudo dpkg --set-selections
查询所有软件状态：sudo dpkg --get-selections | more
查询被锁定的软件：sudo dpkg --get-selections | grep hold
```

### 卡在报头
```plain
可能是上次没有成功导致遗留了部分文件。  
cd /var/cache/apt/archives
sudo rm -rf partial
```

## Ubuntu系统的一些使用方式
### 文件名修改
#### 运用正则表达式统一在文件头部添加上 asdasdasd
```plain
rename  's/^/asdasdasd/' * 
```

### git的基本使用
#### 本地操作
`git init` 把当前目录变成一个git可以管理的仓库  
`git add filename` 把文件/文件夹添加/更新到仓库（类似缓存）  
`git commit -m "information"`把上一个命令添加/更新到仓库的文件/文件夹提交到仓库，并生成信息  
`git status` 查看当前工作区情况  
`git diff filename` 查看文件修改情况  
#### 远程库连接
> 与远程github仓库链接需要sshkey

上传到Github远程仓库  
`git remote add origin https://github.com/yourname/XXX.git`或`git remote add origin git@github.com:yourname/XXX.git`  
`git push -u origin master`  
> 使用`-u`参数，Git不但会把本地的 master 分支内容推送的远程新的 master 分支,还会把本地的 master 分支和远程的 master 分支关联起来。只要本地作了提交,就可以通过命令`git push origin master`把本地 master 分支的最新修改推送至GitHub

关联远程库（从远程库下载再上传更新）  
`git clone git@github.com:yourname/XXX.git`

与远程库合并  
`git pull`

### sshkey

`ssh-keygen -t rsa -C "youremail@example.com"` 创建本地sshkey  会生成在.ssh目录中两个文件，`id_rsa`和`id_rsa.pub`  然后登录Github将`id_rsa.pub`中的内容放入设置中
### 设置开机自启动项
`gnome-session-properties`