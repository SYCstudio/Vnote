# [PKUWC2018]Minimax
[LOJ2537 BZOJ5461]

小 $C$ 有一棵 $n$ 个结点的有根树，根是 $1$ 号结点，且每个结点最多有两个子结点。  
定义结点 $x$ 的权值为：  
1.若 $x$ 没有子结点，那么它的权值会在输入里给出，**保证这类点中每个结点的权值互不相同**。  
2.若 $x$ 有子结点，那么它的权值有 $p_x$ 的概率是它的子结点的权值的最大值，有 $1-p_x$ 的概率是它的子结点的权值的最小值。  
现在小 $C$ 想知道，假设 $1$ 号结点的权值有 $m$ 种可能性，**权值第 $i$ 小**的可能性的权值是 $V_i$，它的概率为 $D_i(D_i>0)$，求：  
$$\sum_{i=1}^{m}i\cdot V_i\cdot D_i^2$$  
你需要输出答案对 $998244353$ 取模的值。

注意到每次有一定概率选较小值而有一定概率选最大值，而且子树最多只有两棵且所有权值互不相同，那么可以在线段树合并的时候，对于左边把右边的答案加上，对于右边把左边的答案加上。需要注意的是，在下放答案的时候，要先递归下去把要左右累加的答案先存起来，再把答案加上，否则就会使得新的答案在这一次就会被重复累计。  
比较好的实现方式是，合并的时候同时向下维护两个变量，只在最下面的时候加，上面的信息由子树得到。

```cpp
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<iostream>
using namespace std;

#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=303000;
const int Mod=998244353;

class SegmentData{
public:
	int ls,rs,sum,mul;
	SegmentData(){
		mul=1;return;
	}
};

int n;
int Son[maxN][2],Val[maxN],num,Num[maxN],Ans;
int nodecnt,rt[maxN];
SegmentData S[maxN*15];

int QPow(int x,int cnt);
void dfs(int x);
void Mul(int x,int mul);
void PushDown(int x);
void Update(int x);
int Merge(int x,int y,int P,int mul1,int mul2);
void Modify(int &x,int l,int r,int pos);
void Calc(int x,int l,int r);
void outp(int x,int l,int r);

int main(){
	scanf("%d",&n);
	for (int i=1;i<=n;i++){
		int fa;scanf("%d",&fa);
		if (!fa) continue;
		if (Son[fa][0]) Son[fa][1]=i;
		else Son[fa][0]=i;
	}
	int inv=QPow(10000,Mod-2);
	for (int i=1;i<=n;i++){
		scanf("%d",&Val[i]);
		if (Son[i][0]==0) Num[++num]=Val[i];
		else Val[i]=1ll*Val[i]*inv%Mod;
	}
	sort(&Num[1],&Num[num+1]);num=unique(&Num[1],&Num[num+1])-Num-1;
	for (int i=1;i<=n;i++) if (Son[i][0]==0) Val[i]=lower_bound(&Num[1],&Num[num+1],Val[i])-Num;
	dfs(1);Calc(rt[1],1,num);
	printf("%d\n",Ans);return 0;
}
int QPow(int x,int cnt){
	int ret=1;
	while (cnt){
		if (cnt&1) ret=1ll*ret*x%Mod;
		x=1ll*x*x%Mod;cnt>>=1;
	}
	return ret;
}
void dfs(int x){
	if (Son[x][0]==0) Modify(rt[x],1,num,Val[x]);
	else if (Son[x][1]==0) dfs(Son[x][0]),rt[x]=rt[Son[x][0]];
	else{
		dfs(Son[x][0]);dfs(Son[x][1]);
		rt[x]=Merge(rt[Son[x][0]],rt[Son[x][1]],Val[x],0,0);
	}
	return;
}
void Mul(int x,int mul){
	S[x].sum=1ll*S[x].sum*mul%Mod;
	S[x].mul=1ll*S[x].mul*mul%Mod;
	return;
}
void PushDown(int x){
	if (S[x].mul!=1){
		if (S[x].ls) Mul(S[x].ls,S[x].mul);
		if (S[x].rs) Mul(S[x].rs,S[x].mul);
		S[x].mul=1;
	}
	return;
}
void Update(int x){
	S[x].sum=0;
	if (S[x].ls) S[x].sum=(S[x].sum+S[S[x].ls].sum)%Mod;
	if (S[x].rs) S[x].sum=(S[x].sum+S[S[x].rs].sum)%Mod;
	return;
}
void Modify(int &x,int l,int r,int pos){
	if (x==0) x=++nodecnt;
	if (l==r){
		S[x].sum=1;return;
	}
	int mid=(l+r)>>1;
	if (pos<=mid) Modify(S[x].ls,l,mid,pos);else Modify(S[x].rs,mid+1,r,pos);
	Update(x);
	return;
}
int Merge(int x,int y,int P,int mul1,int mul2){
	if ((!x)||(!y)){
		if (x) Mul(x,mul1);
		if (y) Mul(y,mul2);
		return x+y;
	}
	PushDown(x);PushDown(y);
	int mll,mlr,mrl,mrr;mll=mlr=mul1;mrl=mrr=mul2;
	if (S[x].ls&&S[y].rs){
		int k1=S[S[x].ls].sum,k2=S[S[y].rs].sum;
		mrr=(1ll*k1*P%Mod+mrr)%Mod;
		mll=(1ll*k2*(1-P+Mod)%Mod+mll)%Mod;
	}
	if (S[x].rs&&S[y].ls){
		int k1=S[S[x].rs].sum,k2=S[S[y].ls].sum;
		mlr=(1ll*k2*P%Mod+mlr)%Mod;
		mrl=(1ll*k1*(1-P+Mod)%Mod+mrl)%Mod;
	}
	S[x].ls=Merge(S[x].ls,S[y].ls,P,mll,mrl);
	S[x].rs=Merge(S[x].rs,S[y].rs,P,mlr,mrr);
	Update(x);
	return x;
}
void Calc(int x,int l,int r){
	if (l==r){
		Ans=(Ans+1ll*l*Num[l]%Mod*S[x].sum%Mod*S[x].sum%Mod)%Mod;
		return;
	}
	int mid=(l+r)>>1;PushDown(x);
	Calc(S[x].ls,l,mid);Calc(S[x].rs,mid+1,r);
	return;
}
void outp(int x,int l,int r){
	if (l==r){
		cout<<l<<":"<<S[x].sum<<" ";
		return;
	}
	PushDown(x);int mid=(l+r)>>1;
	if (S[x].ls) outp(S[x].ls,l,mid);
	if (S[x].rs) outp(S[x].rs,mid+1,r);
}
```