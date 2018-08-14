# Beautiful Pair
[Luogu4755]

小D有个数列 $\{a\}$ ，当一个数对 $(i,j)(i\le j)$ 满足 $a_i$ 和 $a_j$ 的积不大于 $a_i,a_{i+1},\cdots,a_j$ 中的最大值时，小D认为这个数对是美丽的.请你求出美丽的数对的数量。  

考虑找到最大的数，然后枚举更小的一遍，与另一边组合答案。查询可以用可持久化线段树。然后把数列从中间断开，分治两边。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<cmath>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=101000;
const int maxBit=20;
const int inf=2147483647;

class SegmentData
{
public:
	int cnt,ls,rs;
};

int n;
int Val[maxN];
int numcnt,Num[maxN];
int nodecnt,root[maxN];
SegmentData S[maxN*100];
int Mx[maxBit][maxN],MxId[maxBit][maxN],Log[maxN];
ll Ans=0;

void Build(int &now,int l,int r);
void Modify(int &now,int l,int r,int pos);
int GetMax(int l,int r);
int Query(int r1,int r2,int l,int r,int ql,int qr);
void Solve(int l,int r);

int main(){
	for (int i=1;i<maxN;i++) Log[i]=log2(i);
	scanf("%d",&n);
	for (int i=1;i<=n;i++) scanf("%d",&Val[i]),Num[++numcnt]=Val[i];
	sort(&Num[1],&Num[numcnt+1]);numcnt=unique(&Num[1],&Num[numcnt+1])-Num-1;

	for (int i=1;i<=n;i++) Val[i]=lower_bound(&Num[1],&Num[numcnt+1],Val[i])-Num;

	Build(root[0],1,numcnt);
	for (int i=1;i<=n;i++) Modify(root[i]=root[i-1],1,numcnt,Val[i]);

	for (int i=1;i<=n;i++) Mx[0][i]=Val[i],MxId[0][i]=i;
	for (int i=1;i<maxBit;i++)
		for (int j=1;j+(1<<(i-1))<=n;j++){
			if (Mx[i-1][j]>Mx[i-1][j+(1<<(i-1))]) MxId[i][j]=MxId[i-1][j];
			else MxId[i][j]=MxId[i-1][j+(1<<(i-1))];
			Mx[i][j]=max(Mx[i-1][j],Mx[i-1][j+(1<<(i-1))]);
		}

	Solve(1,n);

	printf("%lld\n",Ans);
	return 0;
}

void Build(int &now,int l,int r){
	now=++nodecnt;
	if (l==r) return;
	int mid=(l+r)>>1;
	Build(S[now].ls,l,mid);Build(S[now].rs,mid+1,r);
	return;
}

void Modify(int &now,int l,int r,int pos){
	S[++nodecnt]=S[now];now=nodecnt;
	S[now].cnt++;
	if (l==r) return;
	int mid=(l+r)>>1;
	if (pos<=mid) Modify(S[now].ls,l,mid,pos);
	else Modify(S[now].rs,mid+1,r,pos);
	return;
}

int GetMax(int l,int r){
	int lg=Log[r-l+1];
	if (Mx[lg][l]>Mx[lg][r-(1<<lg)+1]) return MxId[lg][l];
	else return MxId[lg][r-(1<<lg)+1];
}

int Query(int r1,int r2,int l,int r,int ql,int qr){
	if ((l==ql)&&(r==qr)) return S[r2].cnt-S[r1].cnt;
	int mid=(l+r)>>1;
	if (qr<=mid) return Query(S[r1].ls,S[r2].ls,l,mid,ql,qr);
	else if (ql>=mid+1) return Query(S[r1].rs,S[r2].rs,mid+1,r,ql,qr);
	else return Query(S[r1].ls,S[r2].ls,l,mid,ql,mid)+Query(S[r1].rs,S[r2].rs,mid+1,r,mid+1,qr);
}

void Solve(int l,int r){
	if (l>=r){
		if (l==r) if (Num[Val[l]]==1) Ans++;
		return;
	}
	int id=GetMax(l,r),mx=Num[Val[id]];
	int L=1,R=numcnt,pos=0;
	do{
		int mid=(L+R)>>1;
		if (1ll*Num[mid]*Num[Val[id]]<=Num[Val[id]]) pos=mid,L=mid+1;
		else R=mid-1;
	}
	while (L<=R);
	if (pos!=0) Ans=Ans+Query(root[l-1],root[r],1,numcnt,1,pos);
	if (id-l<=r-id){
		for (int i=l;i<id;i++){
			int L=1,R=numcnt,pos=0;
			do{
				int mid=(L+R)>>1;
				if (1ll*Num[mid]*Num[Val[i]]<=Num[Val[id]]) pos=mid,L=mid+1;
				else R=mid-1;
			}
			while (L<=R);
			if (pos!=0) Ans=Ans+Query(root[id],root[r],1,numcnt,1,pos);
		}
	}
	else{
		for (int i=id+1;i<=r;i++){
			int L=1,R=numcnt,pos=0;
			do{
				int mid=(L+R)>>1;
				if (1ll*Num[mid]*Num[Val[i]]<=Num[Val[id]]) pos=mid,L=mid+1;
				else R=mid-1;
			}
			while (L<=R);
			if (pos!=0) Ans=Ans+Query(root[l-1],root[id-1],1,numcnt,1,pos);
		}
	}
	Solve(l,id-1);Solve(id+1,r);
	return;
}
```