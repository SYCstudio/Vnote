# [九省联考2018]IIIDX
[BZOJ5249 Luogu4364]

Osu 听过没？那是 Konano 最喜欢的一款音乐游戏，而他的梦想就是有一天自己也能做个独特酷炫的音乐游戏。现在，他在世界知名游戏公司 KONMAI 内工作，离他的梦想也越来越近了。  
这款音乐游戏内一般都包含了许多歌曲，歌曲越多，玩家越不易玩腻。同时，为了使玩家在游戏上~~氪更多的金钱~~花更多的时间，游戏一开始一般都不会将所有曲目公开，有些曲目你需要通关某首特定歌曲才会解锁，而且越晚解锁的曲目难度越高。  
这一天，Konano 接到了一个任务，他需要给正在制作中的游戏《IIIDX》安排曲目的解锁顺序。游戏内共有 $n$ 首曲目，每首曲目都会有一个难度 $d$，游戏内第 $i$ 首曲目会在玩家 Pass 第 $\left\lfloor \frac i k \right\rfloor$ 首曲目后解锁（$\left\lfloor x \right\rfloor$ 为下取整符号）若 $\left\lfloor \frac i k \right\rfloor = 0$，则说明这首曲目**无需解锁**。  
举个例子：当 $k = 2$ 时，第 $1$ 首曲目是无需解锁的（$\left\lfloor \frac 12 \right\rfloor = 0$），第 $7$ 首曲目需要玩家 Pass 第 $\left\lfloor \frac 72 \right\rfloor = 3$ 首曲目才会被解锁。  
Konano 的工作，便是安排这些曲目的顺序，使得每次解锁出的曲子的难度**不低于**作为条件需要玩家通关的曲子的难度，即使得确定顺序后的曲目的难度对于每个 $i$ 满足 $d_i \geq d_{\left\lfloor \frac ik \right\rfloor}$。  
当然这难不倒曾经在信息学竞赛摸鱼许久的 Konano。那假如是你，你会怎么解决这份任务呢？

不难想到，每一个点对应一棵子树的结构，把所有数排序后，从头开始固定答案。确定一个点的答案时要给其子树内的点预留空间。不妨设 C[i] 表示大于等于排名 i 的数有多少个，用线段树维护这个信息，每次查询是一次线段树上二分，修改则是线段树上区间修改。

```cpp
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<vector>
#include<iostream>
using namespace std;

const int maxN=505000;

int n,Sz[maxN];double K;
int num,Num[maxN],Dif[maxN],Seq[maxN],Del[maxN];
int Mn[maxN<<2],Lazy[maxN<<2];

void Plus(int x,int key);
void PushDown(int x);
void Modify(int x,int l,int r,int ql,int qr,int c);
int Query(int x,int l,int r,int limit);

int main(){
    scanf("%d%lf",&n,&K);
    for (int i=1;i<=n;i++) scanf("%d",&Dif[i]),Num[i]=Dif[i];
    sort(&Num[1],&Num[n+1]);num=unique(&Num[1],&Num[n+1])-Num-1;
    for (int i=1;i<=n;i++) Modify(1,1,num,1,lower_bound(&Num[1],&Num[num+1],Dif[i])-Num,1);
    for (int i=n;i>=1;i--) ++Sz[i],Sz[(int)(i/K)]+=Sz[i];
    for (int i=1;i<=n;i++){
        int fa=i/K;
        if (fa&&!Del[fa]) Del[fa]=1,Modify(1,1,num,1,Seq[fa],Sz[fa]-1);
        printf("%d ",Num[Seq[i]=Query(1,1,num,Sz[i])]);Modify(1,1,num,1,Seq[i],-Sz[i]);
    }
    printf("\n");
    return 0;
}
#define ls (x<<1)
#define rs (ls|1)
void Plus(int x,int key){
    Mn[x]+=key;Lazy[x]+=key;return;
}
void PushDown(int x){
    if (Lazy[x]) Plus(ls,Lazy[x]),Plus(rs,Lazy[x]),Lazy[x]=0;return;
}
void Modify(int x,int l,int r,int ql,int qr,int c){
    if (l==ql&&r==qr) return Plus(x,c);
    int mid=(l+r)>>1;PushDown(x);
    if (qr<=mid) Modify(ls,l,mid,ql,qr,c);else if (ql>=mid+1) Modify(rs,mid+1,r,ql,qr,c);
    else Modify(ls,l,mid,ql,mid,c),Modify(rs,mid+1,r,mid+1,qr,c);
    Mn[x]=min(Mn[ls],Mn[rs]);return;
}
int Query(int x,int l,int r,int limit){
    if (l==r) return Mn[x]>=limit?l:l-1;
    int mid=(l+r)>>1;PushDown(x);
    if (Mn[ls]>=limit) return Query(rs,mid+1,r,limit);
    else return Query(ls,l,mid,limit);
}
```