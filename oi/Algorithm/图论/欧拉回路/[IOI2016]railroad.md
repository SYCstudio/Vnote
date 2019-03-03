# [IOI2016]railroad
[UOJ236]

Anna 在一个游乐园工作。她负责建造一个新的过山车铁路。她已经设计了影响过山车速度的 $n$ 个特殊的路段（方便起见标记为 $0$ 到 $n - 1$）。现在 Anna 必须要把这些特殊的路段放在一起并提出一个过山车的最后设计。为了简化问题，你可以假设过山车的长度为零。  
对于 $0$ 和 $n - 1$ 之间的每个 $i$，这个特殊的路段 $i$ 具有如下两个性质：  
当进入这个路段时，有一个速度限制：过山车的速度必须小于或等于 $s_i$ km/h（每小时千米），  
当离开这个路段时，过山车的速度刚好是 $t_i$ km/h，不管过山车进入该路段时的速度如何。  
最后完成的过山车设计是一个以某种顺序包含这 $n$ 个特殊路段的单一铁路线。这 $n$ 个路段中的每一个应当被使用刚好一次。连续的路段之前用铁轨来连接。Anna 应该选择这 $n$ 个路段的顺序，然后确定每段铁轨的长度。铁轨的长度以米来衡量，可以是任意的非负整数（可以为零）。  
两个特殊路段之间的每 $1$ 米铁轨可以将过山车的速度减慢 $1$ km/h。在这个过山车铁路的起点，过山车按照 Anna 选择的顺序进入第一个特殊路段时的速度是 $1$ km/h。  
最后的设计还必须满足以下要求：  
过山车在进入这些特殊路段时不能违反任一个速度限制；  
过山车的速度在任意时刻为正。

问题转化一下，每一条特殊路段相当于是从速度 s 连一条边到速度 t ，另外定义从低速到高速不需要代价，而从高速走到低速每单位需要单位代价。  
由于从低速走到高速不需要代价，所以若加上一条这样的边，可以认为需要形成一条欧拉回路。要形成欧拉回路有两个条件，第一是所有点度数均为偶数，第二是图连通。通过差分，可以得到需要补充的边使得度数均为偶数，再求最小生成树使得图连通。

```cpp
#include "railroad.h"
#include<algorithm>
#include<vector>
#include<iostream>
using namespace std;

#define Dct(x) (lower_bound(&Num[1],&Num[num+1],x)-Num)
const int maxN=202000*2;
class Edge{
    public:
    int u,v;long long w;
};
int n,ufs[maxN],num,Num[maxN],Sm[maxN];
Edge E[maxN];

int find(int x);
bool cmp(Edge A,Edge B);
long long plan_roller_coaster(vector<int> S,vector<int> T){
    n=S.size();
    for (int i=0;i<n;i++) Num[++num]=S[i],Num[++num]=T[i];
    sort(&Num[1],&Num[num+1]);num=unique(&Num[1],&Num[num+1])-Num-1;
    for (int i=1;i<=num;i++) ufs[i]=i;
    for (int i=0;i<n;i++) S[i]=Dct(S[i]),T[i]=Dct(T[i]),--Sm[S[i]],++Sm[T[i]],ufs[find(S[i])]=find(T[i]);
    ++Sm[1];--Sm[num];ufs[find(1)]=find(num);
    for (int i=1;i<=num;i++) Sm[i]+=Sm[i-1];
    long long Ans=0;int ecnt=0;
    for (int i=1;i<num;i++){
        if (Sm[i]){
            if (Sm[i]<0) Ans=Ans+1ll*(Num[i+1]-Num[i])*(-Sm[i]);
            ufs[find(i)]=find(i+1);
        }
        E[++ecnt]=((Edge){i,i+1,Num[i+1]-Num[i]});
    }
    sort(&E[1],&E[ecnt+1],cmp);
    for (int i=1;i<=ecnt;i++) if (find(E[i].u)!=find(E[i].v)) Ans+=E[i].w,ufs[find(E[i].u)]=find(E[i].v);
    return Ans;
}
int find(int x){
    if (ufs[x]!=x) ufs[x]=find(ufs[x]);
    return ufs[x];
}
bool cmp(Edge A,Edge B){
    return A.w<B.w;
}
```