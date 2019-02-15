# [APIO2018] New Home 新家
[LOJ2585 Luogu4632]

五福街是一条笔直的道路，这条道路可以看成一个数轴，街上每个建筑物的坐标都可以用一个整数来表示。小明是一位时光旅行者，他知道在这条街上，在过去现在和未来共有 $n$ 个商店出现。第 $i$ 个商店可以使用四个整数 $x_i, t_i, a_i, b_i$ 描述，它们分别表示：商店的坐标、商店的类型、商店开业的年份、商店关闭的年份。  
小明希望通过时光旅行，选择一个合适的时间，住在五福街上的某个地方。他给出了一份他可能选择的列表，上面包括了 $q$ 个询问，每个询问用二元组 （坐标，时间）表示。第 $i$ 对二元组用两个整数 $l_i, y_i$ 描述，分别表示选择的地点 $l_i$ 和年份 $y_i$ 。  
现在，他想计算出在这些时间和地点居住的生活质量。他定义居住的不方便指数为：在居住的年份，离居住点最远的商店类型到居住点的距离。类型 $t$ 的商店到居住点的距离定义为：在指定的年份，类型 $t$ 的所有营业的商店中，到居住点距离最近的一家到居住点的距离。我们说编号为 $i$ 的商店在第 $y$ 年在营业当且仅当 $a_i ≤ y ≤ b_i$ 。注意，在某些年份中，可能在五福街上并非所有 $k$ 种类型的商店都有至少一家在营业。在这种情况下，不方便指数定义为 $-1$ 。  
你的任务是帮助小明求出每对（坐标，时间）二元组居住的不方便指数。

对于每一个询问$pos$二分答案$mid$，答案合法当且仅当对于在$[pos-mid,pos+mid]$之间出现了所有商店，也就是说在$[pos+mid,inf]$之间的所有商店对应前一个同种类的商店不能在$pos-mid$之前。那么把询问离线下来，把商店和询问都按照时间排序。查询的相当于是一个区间最小值，那么以位置建立线段树来维护。而前驱的查询和维护可以对每一种类的商店开一个$set$来维护。  
注意到商店的位置可以有重复，所以为了维护最小值，线段树的叶子应该是一个支持删除的小根堆，应该用一个$map$来辅助$set$，用来统计次数。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<set>
#include<queue>
#include<map>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))
#define GetNum(x) (lower_bound(&P[1],&P[poscnt+1],x)-P)
#define lson (now<<1)
#define rson (lson|1)

const int maxN=300100*2;
const int inf=1e9+10;

class Question
{
public:
	int pos,tim,id;
};

class Shop
{
public:
	int pos,kind,tim,opt;
};

class ShopInput
{
public:
	int pos,kind,l,r;
};

class Heap
{
private:
	priority_queue<int,vector<int>,greater<int> > Q,Del;
public:
	void MainTain(){
		while ((!Q.empty())&&(!Del.empty())){
			if (Q.top()==Del.top()) Q.pop(),Del.pop();
			else if (Q.top()>Del.top()) Del.pop();
			else break;
		}
		return;
	}
	void push(int key){
		Q.push(key);return;
	}
	void del(int key){
		Del.push(key);return;
	}
	int top(){
		MainTain();
		if (Q.empty()) return inf;
		else return Q.top();
	}
};

int n,K,Q;
Question Qn[maxN];
Shop Sn[maxN];
ShopInput In[maxN];
int poscnt,P[maxN];
Heap H[maxN];
map<int,int> Mp[maxN];
set<int> S[maxN];
int Mn[maxN<<2];
int emptycnt,Ans[maxN];

bool cmp1(Shop A,Shop B);
bool cmp2(Question A,Question B);
void Add(int pos,int kind);
void Del(int pos,int kind);
void Build(int now,int l,int r);
void Replace(int now,int l,int r,int pos,int k1,int k2);
void Extend(int now,int l,int r,int pos,int key);
void Remove(int now,int l,int r,int pos,int key);
int Query(int now,int l,int r,int ql,int qr);

int main(){
	scanf("%d%d%d",&n,&K,&Q);emptycnt=K;
	for (int i=1;i<=n;i++) scanf("%d%d%d%d",&In[i].pos,&In[i].kind,&In[i].l,&In[i].r),P[++poscnt]=In[i].pos;
	for (int i=1;i<=Q;i++) scanf("%d%d",&Qn[i].pos,&Qn[i].tim),Qn[i].id=i;

	P[++poscnt]=-inf;P[++poscnt]=inf;
	sort(&P[1],&P[poscnt+1]);poscnt=unique(&P[1],&P[poscnt+1])-P-1;

	int scnt=0;
	for (int i=1;i<=n;i++) Sn[++scnt]=((Shop){In[i].pos,In[i].kind,In[i].l,1}),Sn[++scnt]=((Shop){In[i].pos,In[i].kind,In[i].r+1,-1});
	sort(&Sn[1],&Sn[scnt+1],cmp1);

	for (int i=1;i<=K;i++) S[i].insert(inf),S[i].insert(-inf),Mp[i][inf]=1,Mp[i][-inf]=1,H[poscnt].push(-inf);

	Build(1,1,poscnt);

	sort(&Qn[1],&Qn[Q+1],cmp2);

	for (int i=1,j=0;i<=Q;i++){
		while ((j!=scnt)&&(Sn[j+1].tim<=Qn[i].tim)){
			j++;
			if (Sn[j].opt==1) Add(Sn[j].pos,Sn[j].kind);
			if (Sn[j].opt==-1) Del(Sn[j].pos,Sn[j].kind);
		}
		if (emptycnt>0){
			Ans[Qn[i].id]=-1;continue;
		}
		int L=0,R=inf,ans=-1;
		do
		{
			int mid=(L+R)>>1;
			if (Query(1,1,poscnt,min(poscnt,(int)GetNum(Qn[i].pos+mid+1)),poscnt)>=Qn[i].pos-mid) ans=mid,R=mid-1;
			else L=mid+1;
		}
		while (L<=R);
		Ans[Qn[i].id]=ans;
	}

	for (int i=1;i<=Q;i++) printf("%d\n",Ans[i]);
	return 0;
}

bool cmp1(Shop A,Shop B){
	return A.tim<B.tim;
}

bool cmp2(Question A,Question B){
	return A.tim<B.tim;
}
	
void Add(int pos,int kind){
	if (Mp[kind].size()==2) emptycnt--;
	if (Mp[kind].count(pos)==0){
		S[kind].insert(pos);
		set<int>::iterator p1,p2;
		p1=p2=S[kind].find(pos);p1--;
		Extend(1,1,poscnt,GetNum(pos),(*p1));p2++;
		Replace(1,1,poscnt,GetNum(*p2),(*p1),pos);
	}
	Mp[kind][pos]++;
	return;
}

void Del(int pos,int kind){
	if (Mp[kind][pos]==1){
		set<int>::iterator p1,p2;
		p1=p2=S[kind].find(pos);p1--;p2++;
		Remove(1,1,poscnt,GetNum(pos),(*p1));
		Replace(1,1,poscnt,GetNum(*p2),pos,(*p1));
		S[kind].erase(pos);
	}
	Mp[kind][pos]--;
	if (Mp[kind][pos]==0) Mp[kind].erase(Mp[kind].find(pos));
	if (Mp[kind].size()==2) emptycnt++;
	return;
}

void Build(int now,int l,int r){
	if (l==r){
		Mn[now]=H[l].top();return;
	}
	int mid=(l+r)>>1;
	Build(lson,l,mid);Build(rson,mid+1,r);
	Mn[now]=min(Mn[lson],Mn[rson]);return;
}

void Replace(int now,int l,int r,int pos,int k1,int k2){
	if (l==r){
		H[l].del(k1);H[l].push(k2);
		Mn[now]=H[l].top();return;
	}
	int mid=(l+r)>>1;
	if (pos<=mid) Replace(lson,l,mid,pos,k1,k2);
	else Replace(rson,mid+1,r,pos,k1,k2);
	Mn[now]=min(Mn[lson],Mn[rson]);return;
}

void Extend(int now,int l,int r,int pos,int key){
	if (l==r){
		H[l].push(key);Mn[now]=H[l].top();
		return;
	}
	int mid=(l+r)>>1;
	if (pos<=mid) Extend(lson,l,mid,pos,key);
	else Extend(rson,mid+1,r,pos,key);
	Mn[now]=min(Mn[lson],Mn[rson]);return;
}

void Remove(int now,int l,int r,int pos,int key){
	if (l==r){
		H[l].del(key);Mn[now]=H[l].top();
		return;
	}
	int mid=(l+r)>>1;
	if (pos<=mid) Remove(lson,l,mid,pos,key);
	else Remove(rson,mid+1,r,pos,key);
	Mn[now]=min(Mn[lson],Mn[rson]);return;
}

int Query(int now,int l,int r,int ql,int qr){
	if ((l==ql)&&(r==qr)) return Mn[now];
	int mid=(l+r)>>1;
	if (qr<=mid) return Query(lson,l,mid,ql,qr);
	else if (ql>=mid+1) return Query(rson,mid+1,r,ql,qr);
	else return min(Query(lson,l,mid,ql,mid),Query(rson,mid+1,r,mid+1,qr));
}
```