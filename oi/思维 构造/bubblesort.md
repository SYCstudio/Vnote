# bubblesort
[IOI2018试机赛T3]

你有一个长度为$n$的数组$\{a_i\}$，你要对它进行bubble sort。  
你会进行如下操作若干轮直至数组有序：从前往后遍历每一个$i$，若$a_i&gt;a_{i+1}$则交换两数。  
有$q$次修改操作，每次修改原数组中的一个数，并求bubble sort的操作轮数。  
注意这里的修改基于上次修改后的数组而非初始数组。

不难看出，一轮 bubble sort 至少会把一个大于 Ai 且在 i 前面的数扔到后面去，那么答案就应该是 $max(\sum _ {j=1}^i [A _ j>A _ i])$ ，转化一下就变成 $max(i-\sum _ {j=1}^i [A _ j <A _ i])$ ，注意到如果有一个数后面存在一个更小的数，那么这个数肯定没有后面那个更优，故这里的 j 实际上可以枚举到 n ，即 $max(i-\sum _ {j=1}^n[A _ j < A _ i]$ 。用线段树维护这个信息。

```cpp
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<set>
using namespace std;

#define ls (x<<1)
#define rs (ls|1)
const int maxN=505000;

int n,Q,Key[maxN];
int Mx[maxN<<2],Cnt[maxN<<2],Pos[maxN];
set<int> Lf[maxN];

void Build(int x,int l,int r);
void Update(int x);
void Modify(int p);

int main(){
    scanf("%d%d",&n,&Q);for (int i=1;i<=n;i++) scanf("%d",&Key[i]),Lf[Key[i]].insert(i);
    Build(1,1,n);
    while (Q--){
        int pos,key;scanf("%d%d",&pos,&key);
        Lf[Key[pos]].erase(pos);Modify(Key[pos]);
        Key[pos]=key;Lf[key].insert(pos);Modify(key);
        printf("%d\n",Mx[1]);
    }
    return 0;
}

void Build(int x,int l,int r){
    if (l==r){
        Pos[l]=x;Cnt[x]=Lf[l].size();
        if (Lf[l].empty()) Mx[x]=-Cnt[x];
        else Mx[x]=*(Lf[l].rbegin())-Cnt[x];
        return;
    }
    int mid=(l+r)>>1;
    Build(ls,l,mid);Build(rs,mid+1,r);Update(x);return;
}
void Update(int x){
    Cnt[x]=Cnt[ls]+Cnt[rs];
    Mx[x]=max(Mx[ls],Mx[rs]-Cnt[ls]);
    return;
}
void Modify(int p){
    int x=Pos[p];Cnt[x]=Lf[p].size();
    if (Lf[p].empty()) Mx[x]=-Cnt[x];
    else Mx[x]=*(Lf[p].rbegin())-Cnt[x];
    x>>=1;
    while (x){
        Update(x);x>>=1;
    }
    return;
}
```